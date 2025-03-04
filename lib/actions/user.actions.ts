"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { sign } from "crypto";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {
      success: true,
      message: "Signed in successfully!",
    };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// sign user out
export async function signOutUser() {
  await signOut();
}

// sign user up
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const hashedPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: { name: user.name, email: user.email, password: hashedPassword },
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    return {
      success: false,
      message: "User was not registered",
    };
  }
}
