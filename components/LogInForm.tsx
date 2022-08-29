import React, { useState } from "react";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { hashPassword } from "../lib/bcrypt";
import Image from "next/image";
import { toast } from "react-hot-toast";

type SignInInputs = {
  email: string;
  password: string;
};

const LogInForm = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("This field is required"),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInInputs>();

  const onSubmit: SubmitHandler<SignInInputs> = (data) => {
    setSubmitting(true);
    try {
      const { email, password } = data;
      signIn("credentials", { callbackUrl: "/", email, password });
      setTimeout(() => {
        setSubmitting(false);
      }, 800);
      const user = {
        email: email,
        password: hashPassword(password),
      };
      console.log(user);
      console.log(
        "User" + "with " + user.email + user.password + "has been signed up."
      );
      alert(user.email + "  " + user.password);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const signInWithGoogle = () => {
    // TODO: Perform Google auth
    toast.loading("Redirecting...");
    setDisabled(true);
    // Perform sign in
    signIn("google", {
      callbackUrl: window.location.href,
    });
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Email"
          {...register("email")}
          className="flex border bg-white rounded-md w-full mt-2 border-gray-200 px-2 pl-3 focus:outline-none shadow-lg text-gray-600 py-2"
        />
        {errors?.email && (
          <p className="mt-[2px]  rounded-md text-red-600">
            {errors.email.message}
          </p>
        )}

        <input
          placeholder="Password"
          {...register("password")}
          className="flex border pl-3 w-full bg-white rounded-md  border-gray-200 shadow-lg focus:outline-none text-gray-600 mt-2 px-2 py-2"
        />
        {errors?.password && (
          <p className="mt-[2px] text-red-600">{errors.password.message}</p>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 mt-5 rounded-md text-white bg-blue-600 shadow-lg"
        >
          Login
        </button>
      </form>
      <button
        disabled={disabled}
        onClick={() => signInWithGoogle()}
        className="h-[46px] w-full mt-5 mx-auto border border-red-500 rounded-md p-2 flex justify-center items-center space-x-2 shadow-lg text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
      >
        <Image src="/google.svg" alt="Google" width={32} height={32} />
        <span className="text-red-600 hover:font-semibold">
          Sign in with Google
        </span>
      </button>
    </div>
  );
};

export default LogInForm;