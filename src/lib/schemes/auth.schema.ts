import z from "zod";

const nameRegex = /^[A-Za-z]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const egyptMobileRegex = /^(0)(10|11|12|15)\d{8}$/;

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Email must be a valid email"),
  password: z.string().nonempty("Password is required"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters"),

    firstName: z
      .string()
      .nonempty("First name is required")
      .min(3, "First name must be at least 3 characters")
      .regex(nameRegex, "First name must contain only letters"),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .min(3, "Last name must be at least 3 characters")
      .regex(nameRegex, "Last name must contain only letters"),
    email: z.string().email("Email must be a valid email"),
    phone: z.string().nonempty("Phone is required").regex(egyptMobileRegex, "Please enter a valid egyptian number that starts with +20"),

    password: z
      .string()
      .nonempty("Password is required")
      .regex(
        passwordRegex,
        "Password must be at least 8 chars and include upper, lower, number, and special character"
      ),
    rePassword: z.string().nonempty("Re-password is required"),
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

// Account Settings - Profile schema
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .regex(nameRegex, "First name must contain only letters"),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters")
    .regex(nameRegex, "Last name must contain only letters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Email must be a valid email"),
  phone: z.string().nonempty("Phone is required").regex(egyptMobileRegex, "Please enter a valid egyptian number that starts with +20"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

// Account Settings - Change Password schema
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    password: z.string().regex(
      passwordRegex,
      "Password must be at least 8 chars and include upper, lower, number, and special character"
    ),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

// Export regex patterns for reuse
export { nameRegex, passwordRegex, egyptMobileRegex };