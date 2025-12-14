export interface Answer {
    answer: string;
    key: string;
}

export interface Exam {
    _id: string;
    title: string;
    duration: number;
    subject: string;
    numberOfQuestions: number;
    active: boolean;
    createdAt: string;
}

export interface Question {
    answers: Answer[];
    type: string;
    _id: string;
    question: string;
    correct: string;
    subject: string | null;
    exam: Exam;
    createdAt: string;
}

export interface QuestionsResponse {
    message: string;
    questions: Question[];
}