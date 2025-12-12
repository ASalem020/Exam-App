'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    email: string;
    setEmail: (email: string) => void;
    cooldown: number;
    startCooldown: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [email, setEmail] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldown]);

    const startCooldown = () => {
        setCooldown(60);
    };

    return (
        <AuthContext.Provider value={{ email, setEmail, cooldown, startCooldown }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
