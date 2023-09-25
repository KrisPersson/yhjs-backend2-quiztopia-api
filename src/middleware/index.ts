import { sendError } from '../responses/index'
import { MiddyRequest } from "../types/index"

export const validateGetQuery = {
    before: async (request: MiddyRequest) => {
        const queryString = request.event.rawQueryString
        if (request.event.routeKey === 'GET /api/notes' && !queryString) sendError(401, 'No query string provided')
    }
}

