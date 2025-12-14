export interface CorrectQuestion {
    QID: string;
    Question: string;
    correctAnswer: string;
    answers: Record<string, any>; // Using Record<string, any> as the example shows an empty object
}

export interface WrongQuestion {
    QID: string;
    Question: string;
    correctAnswer: string;
    answers: Record<string, any>;
    // Add other fields if WrongQuestions has different structure, assuming similar for now
}

export interface ExamResultResponse {
    message: string;
    correct: number;
    wrong: number;
    total: string;
    WrongQuestions: WrongQuestion[];
    correctQuestions: CorrectQuestion[];
}