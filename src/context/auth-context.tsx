'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface EmailCooldown {
    email: string;
    cooldownStart: number; // timestamp when cooldown started
}

interface AuthContextType {
    currentEmail: string;
    setCurrentEmail: (email: string) => void;
    getCooldown: (email: string) => number;
    startCooldown: (email: string) => void;
    step: 1 | 2 | 3;
    setStep: (step: 1 | 2 | 3) => void;
    clearAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    CURRENT_EMAIL: 'forgot_password_current_email',
    EMAIL_COOLDOWNS: 'forgot_password_email_cooldowns',
    STEP: 'forgot_password_step',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentEmail, setCurrentEmailState] = useState('');
    const [emailCooldowns, setEmailCooldowns] = useState<EmailCooldown[]>([]);
    const [step, setStepState] = useState<1 | 2 | 3>(1);
    const [isHydrated, setIsHydrated] = useState(false);

    // Initialize state from localStorage on mount
    useEffect(() => {
        const storedCurrentEmail = localStorage.getItem(STORAGE_KEYS.CURRENT_EMAIL);
        const storedStep = localStorage.getItem(STORAGE_KEYS.STEP);
        const storedCooldowns = localStorage.getItem(STORAGE_KEYS.EMAIL_COOLDOWNS);

        if (storedCurrentEmail) {
            setCurrentEmailState(storedCurrentEmail);
        }

        if (storedStep) {
            const parsedStep = parseInt(storedStep) as 1 | 2 | 3;
            if ([1, 2, 3].includes(parsedStep)) {
                setStepState(parsedStep);
            }
        }

        if (storedCooldowns) {
            try {
                const parsed = JSON.parse(storedCooldowns) as EmailCooldown[];
                // Filter out expired cooldowns (older than 60 seconds)
                const now = Date.now();
                const active = parsed.filter(item => {
                    const elapsed = Math.floor((now - item.cooldownStart) / 1000);
                    return elapsed < 60;
                });
                setEmailCooldowns(active);

                // Update localStorage with filtered list
                if (active.length !== parsed.length) {
                    localStorage.setItem(STORAGE_KEYS.EMAIL_COOLDOWNS, JSON.stringify(active));
                }
            } catch (error) {
                console.error('Failed to parse email cooldowns:', error);
                setEmailCooldowns([]);
            }
        }

        setIsHydrated(true);
    }, []);

    // Cleanup expired cooldowns every second
    useEffect(() => {
        const interval = setInterval(() => {
            setEmailCooldowns(prev => {
                const now = Date.now();
                const active = prev.filter(item => {
                    const elapsed = Math.floor((now - item.cooldownStart) / 1000);
                    return elapsed < 60;
                });

                // Update localStorage if list changed
                if (active.length !== prev.length) {
                    localStorage.setItem(STORAGE_KEYS.EMAIL_COOLDOWNS, JSON.stringify(active));
                }

                return active;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const setCurrentEmail = (email: string) => {
        setCurrentEmailState(email);
        if (email) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_EMAIL, email);
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_EMAIL);
        }
    };

    const setStep = (newStep: 1 | 2 | 3) => {
        setStepState(newStep);
        localStorage.setItem(STORAGE_KEYS.STEP, newStep.toString());
    };

    const getCooldown = (email: string): number => {
        const cooldownItem = emailCooldowns.find(item => item.email === email);
        if (!cooldownItem) return 0;

        const now = Date.now();
        const elapsed = Math.floor((now - cooldownItem.cooldownStart) / 1000);
        const remaining = Math.max(0, 60 - elapsed);

        return remaining;
    };

    const startCooldown = (email: string) => {
        const now = Date.now();

        setEmailCooldowns(prev => {
            // Remove existing cooldown for this email if any
            const filtered = prev.filter(item => item.email !== email);

            // Add new cooldown
            const updated = [...filtered, { email, cooldownStart: now }];

            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.EMAIL_COOLDOWNS, JSON.stringify(updated));

            return updated;
        });
    };

    const clearAuthState = () => {
        setCurrentEmailState('');
        setEmailCooldowns([]);
        setStepState(1);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_EMAIL);
        localStorage.removeItem(STORAGE_KEYS.EMAIL_COOLDOWNS);
        localStorage.removeItem(STORAGE_KEYS.STEP);
    };

    // Don't render children until hydrated to prevent hydration mismatch
    if (!isHydrated) {
        return null;
    }

    return (
        <AuthContext.Provider value={{
            currentEmail,
            setCurrentEmail,
            getCooldown,
            startCooldown,
            step,
            setStep,
            clearAuthState
        }}>
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
