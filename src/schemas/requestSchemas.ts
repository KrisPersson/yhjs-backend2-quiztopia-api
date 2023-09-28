import { z } from "zod"
import { questionSchema } from "../schemas/index"

export const postQuizRequestBodySchema = z.object({
    userId: z
        .string({
            required_error: "userId is required.",
            invalid_type_error: "userId must be a string."
        })
        .min(1),
    name: z
        .string({
            required_error: "name is required.",
            invalid_type_error: "name must be a string."
        })
        .min(1),
    questions: z
        .array(questionSchema)
        .min(1)
})


export const deleteQuizRequestBodySchema = z.object({
    userId: z
        .string({
            required_error: "userId is required.",
            invalid_type_error: "userId must be a string."
        })
        .min(1),
    quizId: z
        .string({
            required_error: "quizId is required.",
            invalid_type_error: "quizId must be a string."
        })
        .min(1)
})

export const submitScoreRequestBodySchema = z
    .object({
        quizCreatorId: z
            .string({
                required_error: "quizCreatorId is required.",
                invalid_type_error: "quizCreatorId must be a string."
            })
            .min(1),
        quizId: z
            .string({
                required_error: "quizId is required.",
                invalid_type_error: "quizId must be a string."
            })
            .min(1),
        playerId: z
            .string({
                required_error: "playerId is required.",
                invalid_type_error: "playerId must be a string."
            })
            .min(1),
        amtPoints: z
            .number({
                required_error: "amtPoints is required.",
                invalid_type_error: "amtPoints must be a number."
            })
            .min(0)
    }
)

export const updateQuizRequestBodySchema = z
    .object({
        userId: z
            .string({
                required_error: "userId is required.",
                invalid_type_error: "userId must be a string."
            })
            .min(1),
        quizId: z
            .string({
                required_error: "quizId is required.",
                invalid_type_error: "quizId must be a string."
            })
            .min(1),
        question: z
            .string({
                required_error: "question is required.",
                invalid_type_error: "question must be a string."
            })
            .min(1),
        correctAnswer: z
            .string({
                required_error: "correctAnswer is required.",
                invalid_type_error: "correctAnswer must be a string."
            })
            .min(1),
        coordinates: z
            .object({
                longitude: z
                    .string({
                        required_error: "longitude is required.",
                        invalid_type_error: "longitude must be a string."
                    })
                    .min(1),
                latitude: z
                    .string({
                        required_error: "latitude is required.",
                        invalid_type_error: "latitude must be a string."
                    })
                    .min(1)
            })
    })

export const userLoginRequestBodySchema = z
    .object({
        username: z
            .string({
                required_error: "username is required.",
                invalid_type_error: "username must be a string."
            })
            .min(1),
        password: z
            .string({
                required_error: "password is required.",
                invalid_type_error: "password must be a string."
            })
            .min(1)
    })

export const userSignupRequestBodySchema = z
    .object({
        username: z
            .string({
                required_error: "username is required.",
                invalid_type_error: "username must be a string."
            })
            .min(1),
        password: z
            .string({
                required_error: "password is required.",
                invalid_type_error: "password must be a string."
            })
            .min(1),
        email: z
            .string({
                required_error: "email is required.",
                invalid_type_error: "email must be a string."
            })
            .min(1)
    })
