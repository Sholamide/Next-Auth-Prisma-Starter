import React, { useState, useId } from "react";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { hashPassword } from "../lib/bcrypt";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Select from "react-select";
type SignUpInputs = {
  role: string;
  name: string;
  email: string;
  password: string;
};

const SignUpForm = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  let userRoles = [
    { value: "INDIVIDUAL", label: "Individual" },
    { value: "CORPORATE", label: "Corporate" },
  ];
  const handleUserRole = (userRole: any) => {
    const role = userRole.value;

    setUserRole(role);
  };
  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("This field is required"),
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignUpInputs>();
  const onSubmit: SubmitHandler<SignUpInputs> = (data) => {
    setSubmitting(true);
    try {
      signIn("signup", { callbackUrl: "/", data });
      setTimeout(() => {
        setSubmitting(false);
      }, 800);

      console.log(data);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

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
        <select
          className="px-3 py-2 text-gray-800 w-full bg-white focus:outline-none border border-gray-500 rounded-md mb-2"
          {...register("role")}
          onChange={handleUserRole}
          placeholder="Select role"
        >
          <option value="INDIVIDUAL">INDIVIDUAL</option>
          <option value="CORPORATE">CORPORATE</option>
        </select>
        {/* <Controller
          name="role"
          control={control}
          render={({}) => (
            <Select
              isSearchable={false}
              defaultValue={userRole}
              onChange={handleUserRole}
              placeholder="Select role"
              options={userRoles}
              instanceId={useId()}
            />
          )}
          rules={{ required: true }}
        ></Controller> */}

        <input
          placeholder="Full Name"
          {...register("name")}
          className="flex border bg-white rounded-md w-full mt-2 border-gray-200 px-2 pl-3 focus:outline-none shadow-lg text-gray-600 py-2"
        />
        {errors?.name && (
          <p className="mt-[2px]  rounded-md text-red-600">
            {errors.name.message}
          </p>
        )}
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
        <input
          placeholder="Verify Password"
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
          Signup
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
