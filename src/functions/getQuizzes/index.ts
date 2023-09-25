import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
import { validateGetQuery } from '../../middleware/index'
import { errorHandler } from '../../middleware/errorHandler'
import middy from '@middy/core'

import { APIGatewayProxyResult } from "aws-lambda"
import { MiddyEvent, QuizItem } from "../../types/index"

async function getQuizzes(userid: string) {

    const query = await db.query({
        TableName: "quiztopia-db",
        KeyConditionExpression: "#userId = :pk AND begins_with(#itemId, :skprefix)",
        ExpressionAttributeNames: {
            "#userId": "userId",
            "#itemId": "itemId"
        },
        ExpressionAttributeValues: {
            ":pk": userid,
            ":skprefix": "quiz-"
        }
    }).promise()

    const quizzes = query?.Items as QuizItem[]

    return sendResponse({ success: true, quizzes: [...quizzes] })
}

export const handler = middy()
    
    .use(validateToken)
    .use(validateGetQuery)
    .use(errorHandler())
    .handler(async (event: MiddyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const string = event.rawQueryString?.toString() as string
        return await getQuizzes(string)
    })
