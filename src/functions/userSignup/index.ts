import { db } from '../../services/index'
import { sendResponse, sendError } from '../../responses/index'
import { encryptPassword } from '../../bcrypt/index'
import { v4 as uuidv4 } from 'uuid'
import { signupBodySchema } from '../../schemas/index'

import middy from '@middy/core'
import { errorHandler } from '../../middleware/errorHandler'
import httpJsonBodyParser from '@middy/http-json-body-parser'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type userSignupRequestBody = {
    username: string;
    password: string;
    email: string;
}

async function userSignup(body: userSignupRequestBody): Promise<any> {
    const { username, password, email } = body

    const { Count } = await db.query({
        TableName: "quiztopia-db",
        KeyConditionExpression: "#userId = :pk",
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":pk": username
        }
    }).promise()

    if (Count as number > 0) {
        return sendError(409,'User with provided username already exists')
    }

    const hashedPassword = await encryptPassword(password)
    const today = new Date()

    await db.put({
        TableName: 'quiztopia-db',
        Item: {
            userId: username,
            itemId: 'registration',
            id: uuidv4(),
            password: hashedPassword,
            email,
            createdAt: today.toLocaleString()
        }
    }).promise()

    return sendResponse({ success: true, message: 'New user created' })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as userSignupRequestBody
        return await userSignup(body)
    })
