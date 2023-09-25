import { db } from '../../services/index'
import { sendResponse, sendError } from '../../responses/index'
import { editBodySchema } from '../../schemas/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { QuizItem } from "../../types/index"

type updateQuizRequestBody = {
    userId: string;
    quizId: string;
    title: string;
    text: string;
}

async function updateQuiz(body: updateQuizRequestBody) {
    const { title, text, userId, quizId } = body

    const { Item } = await db.get({
        TableName: 'quiztopia-db',
        Key: { userId: userId, itemId: quizId }
    }).promise()

    if (!Item) sendError(404, 'Note could not be found')

    const today = new Date()
    const { Attributes } = await db.update({
        TableName: 'quiztopia-db',
        Key: { userId: userId, itemId: quizId },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set title = :title, #t = :text, modifiedAt = :modifiedAt',
        ExpressionAttributeNames: {
            '#t': 'text'
        },
        ExpressionAttributeValues: {
          ':title': title,
          ':text': text,
          ':modifiedAt': today.toLocaleString()
        }
      }).promise()

      const quiz = {...Attributes} as QuizItem

    return sendResponse({ success: true, updatedQuiz: {...quiz} })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as updateQuizRequestBody
        return await updateQuiz(body)
    })

