import { db } from '../../services/index'
import { sendResponse, sendError } from '../../responses/index'
import { postBodySchema } from '../../schemas/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'
import { v4 as uuidv4 } from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { QuizItem } from "../../types/index"

type submitScoreRequestBody = {
    userId: string;
    itemId: string;
    name: string;
}

async function submitScore(body: submitScoreRequestBody) {
    const { name, userId } = body
    const itemId = uuidv4()
    const today = new Date()
    const item: QuizItem = {
        userId,
        itemId: `quiz-${itemId.slice(0, 10)}`,
        name,
        questions: [],
        leaderboard: [],
        createdAt: today.toLocaleString(),
    }

    await db.put({
        TableName: 'quiztopia-db',
        Item: {...item}
    }).promise()

    return sendResponse({ success: true, newQuiz: {...item} })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as submitScoreRequestBody
        return await submitScore(body)
    })
