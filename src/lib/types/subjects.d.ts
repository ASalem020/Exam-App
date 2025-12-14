export interface SubjectMetadata {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage: number | null;
}

export interface Subject {
    _id: string;
    name: string;
    icon: string;
    createdAt: string;
}

export interface SubjectsResponse {
    message: string;
    metadata: SubjectMetadata;
    subjects: Subject[];
}