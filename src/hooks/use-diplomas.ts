"use client";

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchSubjects, fetchExams, fetchQuestions, checkExamAnswers } from "@/app/(home)/actions/diplomas.actions";

/**
 * Hook for fetching subjects with infinite scroll
 */
export function useSubjects(limit: number = 3) {
    const { data: session } = useSession();

    return useInfiniteQuery({
        queryKey: ["subjects", limit],
        queryFn: async ({ pageParam = 1 }) => {
            if (!session?.accessToken) throw new Error("No access token");
            return fetchSubjects(pageParam, limit, session.accessToken);
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.metadata) {
                const { currentPage, numberOfPages } = lastPage.metadata;
                return currentPage < numberOfPages ? currentPage + 1 : undefined;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!session?.accessToken,
    });
}

/**
 * Hook for fetching exams
 */
export function useExams() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ["exams"],
        queryFn: async () => {
            if (!session?.accessToken) throw new Error("No access token");
            return fetchExams(session.accessToken);
        },
        refetchOnMount: true,
        enabled: !!session?.accessToken,
    });
}

/**
 * Hook for fetching exam questions
 */
export function useExamQuestions(examId: string | null) {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ["singleExam", examId],
        queryFn: async () => {
            if (!session?.accessToken) throw new Error("No access token");
            if (!examId) throw new Error("No exam ID");
            return fetchQuestions(examId, session.accessToken);
        },
        enabled: !!session?.accessToken && !!examId,
        refetchOnWindowFocus: false,
    });
}

/**
 * Hook for submitting exam answers
 */
export function useCheckExamAnswers() {
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (payload: {
            answers: Array<{ questionId: string; correct: string }>;
            time: number;
        }) => {
            if (!session?.accessToken) throw new Error("No access token");
            return checkExamAnswers(payload, session.accessToken);
        },
        onError: (error: Error) => {
            console.error("Error submitting exam:", error);
            alert("Failed to submit exam. Please try again.");
        },
    });
}
