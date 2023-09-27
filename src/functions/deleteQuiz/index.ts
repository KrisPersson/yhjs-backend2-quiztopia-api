import { db } from '../../services/index'
import { sendResponse, sendError } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'
import { z } from "zod"
import { zodValidation } from '../../middleware/zodValidation'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

import { deleteQuizRequestBodySchema } from "../../schemas/requestSchemas"

type deleteQuizRequestBody = z.infer<typeof deleteQuizRequestBodySchema>

async function deleteQuiz(body: deleteQuizRequestBody) {
    const { userId, quizId } = body

    const { Item } = await db.get({
        TableName: 'quiztopia-db',
        Key: { userId: userId, itemId: quizId }
    }).promise()

    if (!Item) sendError(404, 'Quiz could not be found')

    await db.delete({
        TableName: 'quiztopia-db',
        Key: {
            userId,
            itemId: quizId
        }
    }).promise()
    return sendResponse({ success: true, message: 'Quiz successfully deleted!' })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(zodValidation(deleteQuizRequestBodySchema))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as deleteQuizRequestBody
        if (body.quizId === 'registration') sendError(403, 'This endpoint is not allowed to delete user-registrations.')
        return await deleteQuiz(body)
    })
