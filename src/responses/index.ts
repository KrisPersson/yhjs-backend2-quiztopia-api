import { ResponseBody } from "../types/index"
import { AWSError } from "aws-sdk/lib/error"

export function sendError(statusCode: number, message: string) {
    const newError = new Error(message) as AWSError
    newError.statusCode = statusCode
    throw newError
}

export function sendResponse(response: ResponseBody) {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    } 
}

