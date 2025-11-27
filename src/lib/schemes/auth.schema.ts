import z from "zod";

const nameRegex = /^[A-Za-z]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const egyptMobileRegex = /^(0)(10|11|12|15)\d{8}$/;
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),
      
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .regex(nameRegex, "First name must contain only letters"),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .regex(nameRegex, "Last name must contain only letters"),
    email: z.string().email("Email must be a valid email"),
    phone: z.string().nonempty("Phone is required").regex(egyptMobileRegex, "Please enter a valid egyptian number that starts with +20"),
    
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be at least 8 chars and include upper, lower, number, and special character"
      ),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  })
  
  ;
  

export type RegisterSchema = z.infer<typeof registerSchema>;

// Password reset schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be at least 8 chars and include upper, lower, number, and special character"
      ),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;