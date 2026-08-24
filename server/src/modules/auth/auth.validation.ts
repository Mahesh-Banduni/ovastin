import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .email()
    .transform(
      (value) => value.toLowerCase().trim()
    ),

  password: z
    .string()
    .min(8)
});

export const forgotPasswordSchema =
  z.object({
    email: z
      .string()
      .email()
      .transform(
        (value) => value.toLowerCase().trim()
      )
  });

export const resetPasswordSchema =
  z.object({
    email: z
      .string()
      .email()
      .transform(
        (value) => value.toLowerCase().trim()
      ),

    otp: z
      .string()
      .regex(
        /^\d{6}$/,
        "OTP must be 6 digits"
      ),

    newPassword: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters"
      )
  });