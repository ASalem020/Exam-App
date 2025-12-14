export interface ExamMetadata {
    currentPage: number;
    numberOfPages: number;
    limit: number;
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

export interface ExamsResponse {
    message: string;
    metadata: ExamMetadata;
    exams: Exam[];
}