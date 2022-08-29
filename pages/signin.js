import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiEye, HiEyeOff, HiExclamationCircle } from "react-icons/hi";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { classNames } from "../lib/hooks";

const fakeDB = [
  { email: "user1@gmail.com", password: "password" },
  { email: "user2@gmail.com", password: "password2" },
  { email: "user3@gmail.com", password: "password3" },
  { email: "user4@gmail.com", password: "password4" },
];

function PasswordInput({
  label,
  placeholder = "Password",
  helperText = "",
  id,
  readOnly = false,
  validation,
  ...rest
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="mt-3">
      <label
        htmlFor={id}
        className="block w-11 text-lg font-normal text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          {...register(id, validation)}
          {...rest}
          type={showPassword ? "text" : "password"}
          name={id}
          id={id}
          readOnly={readOnly}
          className="bg-transparent shadow-md text-blue-600 rounded-md w-96 px-3 py-4"
          placeholder={placeholder}
          aria-describedby={id}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            togglePassword();
          }}
          className="absolute inset-y-0 right-0 flex items-center p-1 mr-3 rounded-lg"
        >
          {showPassword ? (
            <HiEyeOff className="text-xl text-gray-500 cursor-pointer hover:text-gray-600" />
          ) : (
            <HiEye className="text-xl text-gray-500 cursor-pointer hover:text-gray-600" />
          )}
        </button>
      </div>
      <div className="mt-1">
        {helperText !== "" && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
        {errors[id] && (
          <div className="className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'">
            <HiExclamationCircle className="text-xl text-red-500" />
            <span className="text-sm ml-1 text-red-500">
              {errors[id].message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TextInput({
  label,
  placeholder = "Email",
  helperText = "email",
  id,
  type = "text",
  validation,
  readOnly = false,
  ...rest
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="w-full  max-w-4xl">
      <label htmlFor={id} className="block font-normal text-gray-700 text-lg">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          {...register(id, validation)}
          {...rest}
          type={type}
          name={id}
          id={id}
          className="bg-white border focu text-blue-600 rounded-md w-96 px-3 py-4"
          placeholder={placeholder}
          aria-describedby={id}
        />

        {errors[id] && (
          <div className="className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'">
            <HiExclamationCircle className="text-xl text-red-500" />
            <span className="text-sm ml-1 text-red-500">
              {errors[id].message}
            </span>
          </div>
        )}
      </div>
      <div className="mt-1">
        {helperText !== "" && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
        {/* {errors[id] && (
          <span className="text-sm text-red-500">{errors[id].message}</span>
        )} */}
      </div>
    </div>
  );
}

function Button({ children, className = "", ...rest }) {
  return (
    <button
      {...rest}
      className="inline-flex bg-blue-600 mt-3 px-4 rounded-md py-3 font-bold pl-36 hover:text-primary-500 text-white animated-underline"
    >
      {children}
    </button>
  );
}

function GoogleButton({ children, onClick, className = "", ...rest }) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="inline-flex border mt-14 border-red-500 px-4 rounded-md py-3 text-red-500 font-bold pl-28 hover:text-primary-500"
    >
      {children}
    </button>
  );
}

const signup = () => {
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const { email, password } = data;
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    const user = {
      email: email,
      password: password,
    };
    console.log("User" + " " + email, password + "has been signed in.");
    // alert(email + "  "+ password);
    fakeDB.push(user);
    console.log(fakeDB);
    console.log(res);
  };

  const onGoogleSubmit = async () => {
    const res = await signIn();
    // console.log(res)
  };

  return (
    <>
      <div className="pt-36 min-h-screen bg-white">
        <h1 className="text-center text-2xl font-semibold text-blue-600">
          Sign in to your account
        </h1>
        <div className="mt-10">
          <div className="flex space-y-10  justify-center">
            <FormProvider {...methods}>
              <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                  id="email"
                  label="Email"
                  helperText=""
                  validation={{ required: "email required" }}
                />
                <PasswordInput
                  id="password"
                  label="Password"
                  helperText=""
                  validation={{ required: "enter password" }}
                />
                <Button type="submit">Sign In</Button>
                <GoogleButton
                  onClick={handleSubmit(onGoogleSubmit)}
                  type="submit"
                >
                  Sign in with Google+
                </GoogleButton>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default signup;
