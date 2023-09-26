import { Context, APIGatewayProxyEvent } from 'aws-lambda';


export interface QuizItem {
  userId: string;
  itemId: string;
  createdAt: string;
  name: string;
  questions: Question[],
  leaderboard: Score[]
}

export interface FormattedQuizItem {
  createdBy: string;
  id: string;
  createdAt: string;
  name: string;
  questions: Question[],
  leaderboard: Score[]
}

export interface Question {
  question: string;
  correctAnswer: string;
  coordinates: {
    longitude: string;
    latitude: string;
  }
}

export interface Score {
  playerId: string;
  amtPoints: number;
  completedAt: string;
}

export interface RegistrationItem {
  userId: string;
  itemId: "registration";
  registeredSince: string;
  password: string;
  email: string;
}

export type MiddyEvent = APIGatewayProxyEvent & {
  id?: string;
  userId?: string;
  rawQueryString?: string;
  headers?: any;
  requestContext?: any;
  body?: any;
  error?: Error;
  routeKey?: string;
}

interface MiddyContext extends Context {
  
}

export type MiddyRequest = {
  event: MiddyEvent;
  context: MiddyContext;
  response?: any;
  error?: any;
}

export interface ResponseBody {
    success: boolean;
    quizzes?: QuizItem[] | FormattedQuizItem[];
    message?: string;
    updatedQuiz?: QuizItem | FormattedQuizItem;
    newQuiz?: QuizItem | FormattedQuizItem;
    token?: string;
    leaderboard?: Score[];
}

export type SendResponse = {
    statusCode: number;
    headers: {
        "Content-Type": "application/json"
    },
    body: ResponseBody;
}
