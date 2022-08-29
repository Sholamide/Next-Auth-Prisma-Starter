import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { signIn } from "next-auth/react";
import classNames from "classnames";
import { hashPassword } from "../lib/bcrypt";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("This field is required"),
});

type SignInInputs = {
  email: string;
  password: string;
};

type SignUpInputs = {
  role: string;
  name: string;
  email: string;
  password: string;
};

const AuthModal = ({ show = false, onClose = () => null }) => {
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

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

  const closeModal = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // Reset modal
  useEffect(() => {
    if (!show) {
      // Wait for 200ms for aniamtion to finish
      setTimeout(() => {
        setDisabled(false);
        setConfirm(false);
        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal
          contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 shrink-0 p-1 rounded-md hover:bg-gray-100 transition focus:outline-none"
              >
                <XIcon className="text-blue-500 w-7 h-7" />
              </button>

              <div className="py-16 px-6">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-blue-500 p-1">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                          "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-white shadow"
                            : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                        )
                      }
                    >
                      Login
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                          "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-white shadow"
                            : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                        )
                      }
                    >
                      Sign Up
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      {" "}
                      <div className="px-4 sm:px-12">
                        {/* <div className="flex justify-center">
                          <Link href="/">
                            <a className="flex items-center space-x-1">
                              <span className="text-xl text-blue-500 font-semibold tracking-wide">
                                Welcome back
                              </span>
                            </a>
                          </Link>
                        </div> */}

                        <Dialog.Title
                          as="h3"
                          className="mt-2 font-bold text-blue-500 text-lg sm:text-2xl text-center"
                        >
                          Login
                        </Dialog.Title>

                        <Dialog.Description className="mt-2 text-gray-500 text-base text-center">
                          Login to continue from where you left off!
                        </Dialog.Description>
                        <LogInForm />
                        {/* <div className="mt-10">
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
                              <p className="mt-[2px] text-red-600">
                                {errors.password.message}
                              </p>
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
                            <Image
                              src="/google.svg"
                              alt="Google"
                              width={32}
                              height={32}
                            />
                            <span className="text-red-600 hover:font-semibold">
                              Sign in with Google
                            </span>
                          </button>
                        </div> */}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="px-4 sm:px-12">
                        {/* <div className="flex justify-center">
                          <Link href="/">
                            <a className="flex items-center space-x-1">
                              <span className="text-xl text-blue-500 font-semibold tracking-wide">
                                Next Auth Demo
                              </span>
                            </a>
                          </Link>
                        </div> */}

                        <Dialog.Title
                          as="h3"
                          className="mt-2 font-bold text-blue-500 text-lg sm:text-2xl text-center"
                        >
                          Signup
                        </Dialog.Title>

                        <Dialog.Description className="mt-2 text-gray-500 text-base text-center">
                          Signup to create an account!
                        </Dialog.Description>
                        <SignUpForm />
                        {/* <div className="mt-10">
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
                              <p className="mt-[2px] text-red-600">
                                {errors.password.message}
                              </p>
                            )}
                            <input
                              placeholder="Verify Password"
                              {...register("password")}
                              className="flex border pl-3 w-full bg-white rounded-md  border-gray-200 shadow-lg focus:outline-none text-gray-600 mt-2 px-2 py-2"
                            />
                            {errors?.password && (
                              <p className="mt-[2px] text-red-600">
                                {errors.password.message}
                              </p>
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
                            onClick={() => signInWithGoogle()}
                            className="h-[46px] w-full mt-5 mx-auto border border-red-500 rounded-md p-2 flex justify-center items-center space-x-2 shadow-lg text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
                          >
                            <Image
                              src="/google.svg"
                              alt="Google"
                              width={32}
                              height={32}
                            />
                            <span className="text-red-600 hover:font-semibold">
                              Sign up with Google
                            </span>
                          </button>
                        </div> */}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

AuthModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AuthModal;

// const Confirm = ({ show = false, email = "" }) => (
//   <Transition appear show={show} as={Fragment}>
//     <div className="fixed inset-0 z-50">
//       <Transition.Child
//         as={Fragment}
//         enter="ease-out duration-300"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//         leave="ease-in duration-200"
//         leaveFrom="opacity-100"
//         leaveTo="opacity-0"
//       >
//         <div className="fixed inset-0 bg-white" />
//       </Transition.Child>

//       <Transition.Child
//         as={Fragment}
//         enter="ease-out duration-300"
//         enterFrom="opacity-0 scale-95"
//         enterTo="opacity-100 scale-100"
//         leave="ease-in duration-200"
//         leaveFrom="opacity-100 scale-100"
//         leaveTo="opacity-0 scale-95"
//       >
//         <div className="flex items-center justify-center h-full p-8">
//           <div className="overflow-hidden transition-all transform">
//             <h3 className="text-center text-lg font-medium leading-6">
//               <div className="flex flex-col justify-center items-center space-y-4">
//                 <MailOpenIcon className="w-12 h-12 shrink-0 text-rose-500" />
//               </div>
//               <p className="text-2xl font-semibold mt-2">Confirm your email</p>
//             </h3>

//             <p className="text-lg text-center mt-4">
//               We emailed a magic link to <strong>{email ?? ""}</strong>.
//               <br />
//               Check your inbox and click the link in the email to login or sign
//               up.
//             </p>
//           </div>
//         </div>
//       </Transition.Child>
//     </div>
//   </Transition>
// );

/* <Dialog
as="div"
className="fixed inset-0 z-50 overflow-y-auto"
onClose={closeModal}
>
<Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

<div className="min-h-screen text-center">
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
  </Transition.Child>

   This element is to trick the browser into centering the modal contents. 
  <span
    className="inline-block h-screen align-middle"
    aria-hidden="true"
  >
    &#8203;
  </span>

  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    <div className="inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md max-w-md relative">
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 shrink-0 p-1 rounded-md hover:bg-gray-100 transition focus:outline-none"
      >
        <XIcon className="w-5 h-5" />
      </button>

      <div className="py-12">
        <div className="px-4 sm:px-12">
          <div className="flex justify-center">
            <Link href="/">
              <a className="flex items-center space-x-1">
                <span className="text-xl text-blue-500 font-semibold tracking-wide">
                  Next Auth Demo
                </span>
              </a>
            </Link>
          </div>

          <Dialog.Title
            as="h3"
            className="mt-6 font-bold text-lg sm:text-2xl text-center"
          >
            {showSignIn ? "Welcome back!" : "Login with Google"}
          </Dialog.Title>

          {!showSignIn ? (
            <Dialog.Description className="mt-2 text-gray-500 text-base text-center">
              Please login with google to test nextauth demo.
            </Dialog.Description>
          ) : null}

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
                <p className="mt-[2px] text-red-600">
                  {errors.password.message}
                </p>
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
              <Image
                src="/google.svg"
                alt="Google"
                width={32}
                height={32}
              />
              <span className="text-red-600 hover:font-semibold">
                Sign up with Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition.Child>
</div>
</Dialog> */
