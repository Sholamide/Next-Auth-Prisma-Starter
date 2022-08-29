import { Fragment, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import homes from "../data.json";
import AuthModal from "../components/AuthModal";
import { Menu, Transition } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";
import {
  HeartIcon,
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";

const menuItems = [
  {
    label: "Logout",
    icon: LogoutIcon,
    onClick: signOut,
  },
];

const Home = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === "loading";
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="py-0 px-8">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-[2rem] flex-1 flex flex-col justify-center items-center">
        <h1 className="text-[#0070f3] m-0 leading-none text-6xl">
          NextJS <a href="https://nextjs.org">Auth Demo!</a>
        </h1>

        {isLoadingUser ? (
          <div className="h-15 w-[75px] bg-gray-200 animate-pulse rounded-md" />
        ) : user ? (
          <Menu as="div" className="relative z-50">
            <Menu.Button className="flex items-center space-x-px group">
              <div className="shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9">
                {user?.image ? (
                  <Image
                    src={user?.image}
                    alt={user?.name || "Avatar"}
                    layout="fill"
                  />
                ) : (
                  <UserIcon className="text-gray-400 w-6 h-6" />
                )}
              </div>
              <ChevronDownIcon className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-current" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-72 overflow-hidden mt-1 divide-y divide-gray-100 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="flex items-center space-x-2 py-4 px-4 mb-2">
                  <div className="shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9">
                    {user?.image ? (
                      <Image
                        src={user?.image}
                        alt={user?.name || "Avatar"}
                        layout="fill"
                      />
                    ) : (
                      <UserIcon className="text-gray-400 w-12 h-12" />
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span>{user?.name}</span>
                    <span className="text-sm text-gray-500">{user?.email}</span>
                  </div>
                </div>

                <div className="py-2">
                  {menuItems.map(({ label, href, onClick, icon: Icon }) => (
                    <div
                      key={label}
                      className="px-2 last:border-t last:pt-2 last:mt-2"
                    >
                      <Menu.Item>
                        {href ? (
                          <Link href={href}>
                            <a className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100">
                              <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                              <span>{label}</span>
                            </a>
                          </Link>
                        ) : (
                          <button
                            className="w-full flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100"
                            onClick={onClick}
                          >
                            <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                            <span>{label}</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="ml-4 mt-10 text-xl px-4 py-2 my-3 rounded-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white transition"
          >
            Log in
          </button>
        )}
        <AuthModal show={showModal} onClose={closeModal} />
      </main>
    </div>
  );
};

export default Home;
