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
    question: string;
    correctAnswer: string;
    coordinates: {
        longitude: string;
        latitude: string;
    }
}

async function updateQuiz(body: updateQuizRequestBody) {
    const { question, correctAnswer, userId, quizId, coordinates } = body

    const { Item } = await db.get({
        TableName: 'quiztopia-db',
        Key: { userId: userId, itemId: quizId }
    }).promise()

    if (!Item) sendError(404, 'Quiz could not be found')

    const newQuestion = {
        question,
        correctAnswer,
        coordinates
    }

    const questions = [...Item?.questions]
    questions.push({...newQuestion})

    await db.update({
        TableName: 'quiztopia-db',
        Key: { userId: userId, itemId: quizId },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set questions = :questions',
        ExpressionAttributeValues: {
          ':questions': [...questions]
        }
      }).promise()

      const updatedQuiz = {
        createdBy: Item?.userId,
        id: Item?.itemId,
        name: Item?.name,
        questions: [...questions],
        leaderboard: [...Item?.leaderboard],
        createdAt: Item?.createdAt,
      }

    return sendResponse({ success: true, updatedQuiz: {...updatedQuiz} })
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

