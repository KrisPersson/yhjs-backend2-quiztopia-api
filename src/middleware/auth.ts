import jwt from 'jsonwebtoken'
import { MiddyRequest } from '../types'
import { sendError } from '../responses'

export const validateToken = {
    before: async (request: MiddyRequest) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '').replace('Bearer', '')
            const providedUserId = request.event.requestContext.http.method === 'GET' ? request.event.rawQueryString : request?.event.body.userId
            if (!token) sendError(401, 'No token provided')
            const data = jwt.verify(token, 'a1b1c1') as jwt.JwtPayload
            if (!data.id || !data.userId) sendError(401, 'Invalid token')
            if (providedUserId !== data.userId) sendError(401, 'Provided userId does not match currently logged-in user')
            request.event.id = data.id
            request.event.userId = data.userId
        } catch (error) {
            sendError(401, 'Invalid token')
        }
    }
}
