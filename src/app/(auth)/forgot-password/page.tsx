"use client";

import React, { useState } from 'react'
import ForgotForm from './_components/forgot-form'
import VerifyOTPForm from './_components/verify-otp-form'
import CreatePasswordForm from './_components/create-password-form'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState<string>("")

  return (
    <>
      {step === 1 && (
        <ForgotForm 
          onSuccess={(userEmail: string) => {
            setEmail(userEmail)
            setStep(2)
          }}
        />
      )}
      {step === 2 && (
        <VerifyOTPForm 
          email={email}
          onSuccess={() => setStep(3)}
          onBack={() => setStep(1)}
          onEdit={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <CreatePasswordForm 
          email={email}
        />
      )}
    </>
  )
}
