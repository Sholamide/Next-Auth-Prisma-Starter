import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiEye, HiEyeOff, HiExclamationCircle } from "react-icons/hi";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";


const fakeDB = [
    {"email":"user1@gmail.com","password":"password"},
    {"email":"user2@gmail.com","password":"password2"},
    {"email":"user3@gmail.com","password":"password3"},
    {"email":"user4@gmail.com","password":"password4"},
]

function PasswordInput({
  label,
  placeholder = "",
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
    <div>
      <label htmlFor={id} className="">
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
          //   className={classNames(
          //     readOnly
          //       ? 'bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
          //       : errors[id]
          //       ? 'focus:ring-red-500 border-red-500 focus:border-red-500'
          //       : 'focus:ring-primary-500 border-gray-300 focus:border-primary-500',
          //     'block w-full rounded-md shadow-sm'
          //   )}
          placeholder={placeholder}
          aria-describedby={id}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            togglePassword();
          }}
          className="absolute inset-y-0 right-0 flex items-center p-1 mr-3 rounded-lg focus:outline-none focus:ring focus:ring-primary-500"
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
          <span className="text-sm text-red-500">{errors[id].message}</span>
        )}
      </div>
    </div>
  );
}

function TextInput({
  label,
  placeholder = "",
  helperText = "",
  id,
  type = "text",
  readOnly = false,
  validation,
  ...rest
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <label htmlFor={id} className="">
        {label}
      </label>
      <div className="">
        <input
          {...register(id, validation)}
          {...rest}
          type={type}
          name={id}
          id={id}
          readOnly={readOnly}
          //   className={classNames(
          //     readOnly
          //       ? 'bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
          //       : errors[id]
          //       ? 'focus:ring-red-500 border-red-500 focus:border-red-500'
          //       : 'focus:ring-primary-500 border-gray-300 focus:border-primary-500',
          //     'block w-full rounded-md shadow-sm'
          //   )}
          placeholder={placeholder}
          aria-describedby={id}
        />

        {errors[id] && (
          <div className="">
            <HiExclamationCircle className="" />
          </div>
        )}
      </div>
      <div className="">
        {helperText !== "" && <p className="">{helperText}</p>}
        {errors[id] && <span className="">{errors[id].message}</span>}
      </div>
    </div>
  );
}

function Button({ children, className = "", ...rest }) {
  return (
    <button
      {...rest}
      //   className={classNames(
      //     "inline-flex items-center font-bold hover:text-primary-500 animated-underline",
      //     className
      //   )}
    >
      {children}
    </button>
  );
}

const signup = () => {
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    const {email,password} = data
    const user = {
        "email":email,
        "password":password
    }
    console.log("User" + " "+{email,password} + "has been signed up.");
    alert(email + "  "+ password);
    fakeDB.push(user);
    console.log(fakeDB);
  };

  return (
    <>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 style={{ color: "black" }}>Sign Up</h1>
            <TextInput
              id="email"
              label="Email"
              helperText=""
              // validation={{ required: 'email required' }}
            />
            <PasswordInput
              id="password"
              label="Password"
              helperText=""
              // validation={{ required: 'Custom error message' }}
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default signup;
