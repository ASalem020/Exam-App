export type LoginResponse ={

    message: string;
    token: string;
    user: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
        isVerified: boolean;
        _id: string;
        createdAt: string;
    };
};


