import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'
import { v4 as uuidv4 } from 'uuid'
import { sortLeaderboard } from "../../utils"

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { postQuizRequestBodySchema } from '../../schemas/requestSchemas'
import { QuizItem } from '../../schemas/index'
import { FormattedQuizItem } from "../../types/index"
import { zodValidation } from '../../middleware/zodValidation'
import { z } from "zod"

type postQuizRequestBody = z.infer<typeof postQuizRequestBodySchema>

async function createQuiz(body: postQuizRequestBody) {
    const { name, userId, questions } = body
    const itemId = uuidv4()
    const today = new Date()
    const item: QuizItem = {
        userId,
        itemId: `quiz-${itemId.slice(0, 10)}`,
        name,
        questions,
        leaderboard: [],
        createdAt: today.toLocaleString(),
    }

    await db.put({
        TableName: 'quiztopia-db',
        Item: {...item}
    }).promise()

    const formattedItem: FormattedQuizItem = {
        createdBy: item.userId,
        id: item.itemId,
        name: item.name,
        questions: [...item.questions],
        leaderboard: [...sortLeaderboard(item.leaderboard)],
        createdAt: item.createdAt,
    }

    return sendResponse({ success: true, newQuiz: {...formattedItem } })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(zodValidation(postQuizRequestBodySchema))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as postQuizRequestBody
        return await createQuiz(body)
    })
