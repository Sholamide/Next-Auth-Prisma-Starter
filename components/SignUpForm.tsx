import React, { useState } from "react";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Role } from "@prisma/client";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
type ISignUpValues = {
  userrole: Role;
  name: string;
  email: string;
  password: string;
  verifypassword: string;
};

const user_roles = [
  { label: "Role", value: "ROLE" },
  { label: "Individual", value: "Individual" },
  { label: "Corporate", value: "Corporate" },
];

const signUpSchema = yup.object().shape({
  userrole: yup
    .string()
    .required("Select a user role")
    .oneOf(["Individual", "Corporate"])
    .label("User role"),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Need to be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain at least 8 characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  verifypassword: yup
    .string()
    .required("Please confirm password")
    .oneOf([yup.ref("password")], "Passwords do not match."),
});

const SignUpForm = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const createAccountHandler = async (data: ISignUpValues) => {
    const response = axios.post("/api/auth/user/signup", {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.userrole.toUpperCase(),
    });
    return response;
  };

  const onSubmit = async (data: ISignUpValues) => {
    setSubmitting(true);
    console.log(data);
    try {
      await createAccountHandler(data)
        .then((response) => {
          signIn("signin", {
            callbackUrl: "/",
            email: data.email,
            password: data.password,
          });
        })
        .catch((error) => {});
      setTimeout(() => {
        setSubmitting(false);
      }, 850);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      toast.success("Account Created");
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISignUpValues>({ resolver: yupResolver(signUpSchema) });

  const signUpWithGoogle = () => {
    // TODO: Perform Google auth
    toast.loading("Redirecting...");
    setDisabled(true);
    // Perform sign up
    signIn("google", {
      callbackUrl: window.location.href,
    });
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="text-md text-gray-700"> Select User Role</label>
        <Controller
          name="userrole"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              isSearchable={false}
              options={user_roles}
              className="form-control"
              value={user_roles.find((r) => r.value === value)}
              onChange={(val) => onChange(val?.value)}
            />
          )}
        />
        <span className="mt-[1px] text-[8px] rounded-md text-red-600">
          {errors["userrole"]?.message}
        </span>
        <input
          id="name"
          placeholder="Full Name"
          {...register("name")}
          className="flex border bg-white rounded-md w-full mt-2 border-gray-200 px-2 pl-3 focus:outline-none shadow-lg text-gray-600 py-2"
        />
        {errors?.name && (
          <span className="mt-[1px] text-[8px] rounded-md text-red-600">
            {errors.name.message}
          </span>
        )}
        <input
          id="email"
          placeholder="Email"
          {...register("email")}
          className="flex border bg-white rounded-md w-full mt-2 border-gray-200 px-2 pl-3 focus:outline-none shadow-lg text-gray-600 py-2"
        />
        {errors?.email && (
          <span className="mt-[1px] text-[8px] rounded-md text-red-600">
            {errors.email.message}
          </span>
        )}

        <input
          id="password"
          placeholder="Password"
          {...register("password")}
          className="flex border pl-3 w-full bg-white rounded-md  border-gray-200 shadow-lg focus:outline-none text-gray-600 mt-2 px-2 py-2"
        />
        {errors?.password && (
          <span className="mt-[1px] text-[8px] text-red-600">
            {errors.password.message}
          </span>
        )}
        <input
          id="verifypassword"
          placeholder="Verify Password"
          {...register("verifypassword")}
          className="flex border pl-3 w-full bg-white rounded-md  border-gray-200 shadow-lg focus:outline-none text-gray-600 mt-2 px-2 py-2"
        />
        {errors?.verifypassword && (
          <span className="mt-[1px] text-[8px] text-red-600">
            {errors?.verifypassword.message}
          </span>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 mt-5 rounded-md text-white bg-blue-600 shadow-lg"
        >
          {isSubmitting ? <ClipLoader /> : <p>Signup</p>}
        </button>
      </form>
      <button
        disabled={disabled}
        onClick={() => signUpWithGoogle()}
        className="h-[46px] w-full mt-5 mx-auto border border-red-500 rounded-md p-2 flex justify-center items-center space-x-2 shadow-lg text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
      >
        <Image src="/google.svg" alt="Google" width={32} height={32} />
        <span className="text-red-600 hover:font-semibold">
          Sign up with Google
        </span>
      </button>
    </div>
  );
};

export default SignUpForm;
