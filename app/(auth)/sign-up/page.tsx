"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type { z } from "zod";
import { signUpSchema } from "@/validations/User";
import { signUp } from "@/app/actions/auth";

const SignUp = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof signUpSchema>,
    unknown,
    z.output<typeof signUpSchema>
  >({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: z.output<typeof signUpSchema>) => {
    setServerError(null);
    setServerSuccess(null);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role || "user");

    try {
      const result = await signUp(null, formData);

      if (!result.success) {
        setServerError(result.error || "SignUp failed");
      } else {
        reset();
        setServerSuccess(result.message || "Account created");
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
    } finally {
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your details to get started
          </p>
        </div>

        {serverError && (
          <p style={{ color: "red", fontWeight: "bold" }}>{serverError}</p>
        )}
        {serverSuccess && (
          <p style={{ color: "green", fontWeight: "bold" }}>{serverSuccess}</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            <span>Username</span>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            {errors.username && (
              <p style={{ color: "red" }}>{errors.username.message}</p>
            )}
          </label>

          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            <span>Email</span>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </label>

          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            <span>Password</span>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            {isSubmitting ? "Submitting" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-zinc-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default SignUp;
