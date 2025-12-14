"use client";

import React from 'react'
import ForgotForm from './_components/forgot-form'
import VerifyOTPForm from './_components/verify-otp-form'
import CreatePasswordForm from './_components/create-password-form'
import { useAuth } from '@/context/auth-context'

export default function ForgotPasswordPage() {
  

  /* -------------------------------------------------------------------------- */
  /*                                   CONTEXT                                  */
  /* -------------------------------------------------------------------------- */
  const { step, setStep, currentEmail, setCurrentEmail } = useAuth();

  return (
    <>
      {step === 1 && (
        <ForgotForm
          onSuccess={(userEmail: string) => {
            setCurrentEmail(userEmail)
            setStep(2)
          }}
        />
      )}
      {step === 2 && (
        <VerifyOTPForm
          email={currentEmail}
          onSuccess={() => setStep(3)}
          onBack={() => setStep(1)}
          onEdit={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <CreatePasswordForm
          email={currentEmail}
        />
      )}
    </>
  )
}
