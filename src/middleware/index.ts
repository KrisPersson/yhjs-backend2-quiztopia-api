import { sendError } from '../responses/index'
import { MiddyRequest } from "../types/index"
import { HttpError } from "http-errors"

export const validateGetHeaders = {
    before: async (request: MiddyRequest) => {
        try {
            if (request.event.headers.hasOwnProperty('creator_id') &&
                request.event.headers.hasOwnProperty('quiz_id')) {
                const { creator_id, quiz_id } = request.event.headers
                if (typeof creator_id !== "string") sendError(400, 'creator_id must be a string')
                if (typeof quiz_id !== "string") sendError(400, 'quiz_id must be a string')
            }
        } catch (error) {
            if (error instanceof HttpError) sendError(error.statusCode, error.message)
            sendError(401, 'Invalid token')
        }
    }
}
