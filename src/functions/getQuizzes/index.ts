import { db } from '../../services/index'
import { sendError, sendResponse } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
import { errorHandler } from '../../middleware/errorHandler'
import { validateGetHeaders } from "../../middleware/index"
import middy from '@middy/core'

import { APIGatewayProxyResult } from "aws-lambda"
import { MiddyEvent} from "../../types/index"
import { QuizItem } from "../../schemas/index"
import { FormattedQuizItem } from '../../types/index'
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
            name: quiz.name
        }
    })

    return sendResponse({ success: true, quizzes: [...formattedQuizzes] })
}

async function getQuiz(userId: string, itemId: string) {

    const result = await db.get({
        TableName: "quiztopia-db",
        Key: {
            userId,
            itemId
        }
    }).promise()

    if (!result.Item) sendError(404, 'No quiz found')

    const quiz = result.Item as QuizItem
    
    const formattedQuiz: FormattedQuizItem = {
        createdBy: quiz.userId,
        id: quiz.itemId,
        createdAt: quiz.createdAt,
        name: quiz.name,
        questions: [...quiz.questions],
        leaderboard: [...sortLeaderboard(quiz.leaderboard)]
    }

    return sendResponse({ success: true, quiz: formattedQuiz })

}

export const handler = middy()
    
    .use(validateToken)
    .use(errorHandler())
    .use(validateGetHeaders)
    .handler(async (event: MiddyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const {creator_id, quiz_id } = event?.headers
        return creator_id && quiz_id ? 
            await getQuiz(creator_id, quiz_id) : 
            await getQuizzes()
    })
