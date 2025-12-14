"use server";

/**
 * Server Actions for Diplomas/Subjects Management
 */

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */


/**
 * Fetch subjects/diplomas with pagination
 */
export async function fetchSubjects(page: number, limit: number, token: string) {
    const res = await fetch(`${process.env.API}/subjects?page=${page}&limit=${limit}`, {
        headers: {
            token: token
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch subjects");
    }

    const payload = await res.json();
    return payload;
}

/**
 * Fetch exams for a subject
 */
export async function fetchExams(token: string) {
    const res = await fetch(`${process.env.API}/exams`, {
        headers: {
            token: token
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch exams");
    }

    const payload = await res.json();
    return payload;
}

/**
 * Fetch questions for an exam
 */
export async function fetchQuestions(examId: string, token: string) {
    const res = await fetch(`${process.env.API}/questions/?exam=${examId}`, {
        headers: {
            token: token
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch questions");
    }

    const payload = await res.json();
    return payload;
}

/**
 * Submit exam answers for checking
 */
export async function checkExamAnswers(
    payload: {
        answers: Array<{ questionId: string; correct: string }>;
        time: number;
    },
    token: string
) {
    const res = await fetch(`${process.env.API}/questions/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to submit exam answers");
    }

    const result = await res.json();
    return result;
}
