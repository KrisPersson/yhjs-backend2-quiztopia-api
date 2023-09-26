import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
// import { validateGetQuery } from '../../middleware/index'
import { errorHandler } from '../../middleware/errorHandler'
import middy from '@middy/core'

import { APIGatewayProxyResult } from "aws-lambda"
import { MiddyEvent, QuizItem } from "../../types/index"
import { sortLeaderboard } from "../../utils"

async function getQuizzes() {

    const query = await db.scan({
        TableName: "quiztopia-db",
        FilterExpression: "begins_with(#itemId, :skprefix)",
        ExpressionAttributeNames: {
            "#itemId": "itemId"
        },
        ExpressionAttributeValues: {
            ":skprefix": "quiz-"
        }
    }).promise()

    const quizzes = query?.Items as QuizItem[]
    const formattedQuizzes = quizzes.map(quiz => {
        return {
            createdBy: quiz.userId,
            id: quiz.itemId,
            createdAt: quiz.createdAt,
            name: quiz.name,
            questions: [...quiz.questions],
            leaderboard: [...sortLeaderboard(quiz.leaderboard)]
        }
    })

    return sendResponse({ success: true, quizzes: [...formattedQuizzes] })
}

export const handler = middy()
    
    .use(validateToken)
    .use(errorHandler())
    .handler(async (event: MiddyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        return await getQuizzes()
    })
