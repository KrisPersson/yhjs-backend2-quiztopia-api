import { z } from "zod"

export const questionSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  coordinates: z.object({
    longitude: z.string(),
    latitude: z.string()
  })
})
export type Question = z.infer<typeof questionSchema>

export const scoreSchema = z.object({
  playerId: z.string(),
  amtPoints: z.number(),
  completedAt: z.string(),
})
export type Score = z.infer<typeof scoreSchema>

export const quizItemSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
  createdAt: z.string(),
  name: z.string(),
  questions: z.array(questionSchema),
  leaderboard: z.array(scoreSchema)
})
export type QuizItem = z.infer<typeof quizItemSchema>
