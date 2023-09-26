import { db } from '../../services/index'
import { sendResponse, sendError } from '../../responses/index'
import { postBodySchema } from '../../schemas/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { QuizItem, Score } from "../../types/index"
import { sortLeaderboard } from '../../utils'

type submitScoreRequestBody = {
    quizCreatorId: string;
    quizId: string;
    playerId: string;
    amtPoints: number;
}

async function submitScore(body: submitScoreRequestBody) {
    const { quizCreatorId, quizId, playerId, amtPoints } = body

    const { Item } = await db.get({
        TableName: 'quiztopia-db',
        Key: { userId: quizCreatorId, itemId: quizId }
    }).promise()

    if (!Item) sendError(404, 'Quiz could not be found')

    const today = new Date()
    const scoreItem: Score = {
        playerId,
        amtPoints,
        completedAt: today.toLocaleString()
    }

    const leaderboard = [...Item?.leaderboard]
    leaderboard.push({...scoreItem})

    await db.update({
        TableName: 'quiztopia-db',
        Key: { userId: quizCreatorId, itemId: quizId },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set leaderboard = :leaderboard',
        ExpressionAttributeValues: {
          ':leaderboard': [...leaderboard]
        }
      }).promise()

    return sendResponse({ success: true, leaderboard: sortLeaderboard(leaderboard) })
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
