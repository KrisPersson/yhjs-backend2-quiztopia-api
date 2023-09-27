import { db } from '../../services/index'
import jwt from 'jsonwebtoken'

import { sendResponse, sendError } from '../../responses/index'
import { comparePassword } from '../../bcrypt/index'
import middy from '@middy/core'
import { errorHandler } from '../../middleware/errorHandler'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { userLoginRequestBodySchema } from "../../schemas/requestSchemas"
import { z } from "zod"
import { zodValidation } from '../../middleware/zodValidation'


import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type userLoginRequestBody = z.infer<typeof userLoginRequestBodySchema>

async function userLogin(body: userLoginRequestBody): Promise<any> {
    const { username, password } = body

    const { Item } = await db.get({
        TableName: "quiztopia-db",
        Key: {
            userId: username,
            itemId: 'registration'
        }
    }).promise()

    if (!Item) return sendError(401, 'Wrong username/password combination')
    const passwordDoesMatch = await comparePassword(password, Item?.password)
    if (!passwordDoesMatch) return sendError(401, 'Wrong username/password combination')

    const token = jwt.sign({ userId: Item.userId }, 'a1b1c1', {
        expiresIn: 864000
    })

    return sendResponse({ success: true, message: 'User logged in!', token })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(zodValidation(userLoginRequestBodySchema))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as userLoginRequestBody

        return await userLogin(body)
    })
