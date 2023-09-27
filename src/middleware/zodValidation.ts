import middy from "@middy/core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { sendError } from "../responses/index"
import z from "zod"

export function zodValidation(
  schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> {
  return {
    before: async (handler) => {
      try {
        schema.parse(handler.event.body)
      } catch (error) {
        let err = error as z.ZodError
        sendError(400, err.issues[0].message)
      }
    }
  }
}