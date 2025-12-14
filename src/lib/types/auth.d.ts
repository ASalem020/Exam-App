export type LoginResponse = {

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

export interface RegisterFormFields {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    rePassword: string;
}

export interface LoginFormFields {
    email: string;
    password: string;
}

export interface ForgotFormFields {
    email: string;
}

export interface VerifyOTPFormFields {
    otp: string;
}

export interface CreatePasswordFormFields {
    password: string;
    rePassword: string;
}


