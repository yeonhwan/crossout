// Next
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

// React, hooks
import { useState } from "react";

//ICONS
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import LoaderIcon from "public/icons/spinner.svg";
import LogoSimple from "public/logo/logo_simple.svg";
import Waves from "public/icons/waves.svg";

// NextAuth
import { signIn } from "next-auth/react";

// type
import { type NextPageWithLayout } from "@/pages/_app";

// styles
import form_styles from "@/styles/form.module.css";

const SignIn: NextPageWithLayout = () => {
  const [isProceed, setIsProceed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const router = useRouter();

  const gitHubSignIn = async () => {
    setIsProceed(true);
    const res = await signIn("github", {
      callbackUrl: "/oauth",
    });
    if (res?.error) {
      setErrMessage(res.error);
    }
  };

  const googleSignIn = async () => {
    setIsProceed(true);
    const res = await signIn("google", { callbackUrl: "/oauth" });
    console.log(res);
    if (res?.error) {
      setErrMessage(res.error);
    }
  };

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formEl = document.querySelector<HTMLFormElement>("form");
    formEl?.classList.remove(form_styles.invalid as string);
    e.preventDefault();
    setIsProceed(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: emailInput,
      password: passwordInput,
    });

    if (res?.error) {
      formEl?.classList.add(form_styles.invalid as string);
      setErrMessage(res.error);
      setIsProceed(false);
    } else {
      router.push("myapp/home");
    }
  };

  return (
    <div className="main_background relative flex h-full w-full items-center justify-center overflow-hidden">
      <Head>
        <title>Crossout - Sign in</title>
      </Head>
      <main className="absolute left-0 top-0 h-full w-full bg-pattern bg-repeat opacity-40"></main>
      <form className="z-50 flex h-max w-[85%] max-w-[500px] flex-col rounded-lg border-2 border-zinc-300 bg-white p-12 shadow-lg sm:w-4/12 sm:min-w-[450px]">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex h-max w-full flex-col items-center justify-center hover:cursor-pointer"
        >
          <LogoSimple className="mb-2 h-8 w-8 fill-none stroke-teal-400" />
          <p className="mb-2 text-xs font-bold text-teal-500">CROSSOUT</p>
        </div>
        <h1 className="mb-5 w-full text-center text-base font-bold sm:text-xl">
          Sign In
        </h1>
        <p id="err_message" className="text-xs text-red-600 sm:text-base">
          {errMessage}
        </p>
        <div className="group flex h-max w-full flex-col justify-center">
          <label
            className="mt-4 text-sm font-bold text-gray-700 group-focus-within:text-teal-400 sm:text-base"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="type in your email"
            className="w-full p-2 group-focus-within:outline-teal-400"
            value={emailInput}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setEmailInput(e.currentTarget.value);
            }}
          />
        </div>
        <div className="group flex h-max w-full flex-col justify-center">
          <label
            className="mt-4 text-sm font-bold text-gray-700 group-focus-within:text-teal-400 sm:text-base"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="type in your password"
            className="w-full p-2 group-focus-within:outline-teal-400"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setPasswordInput(e.currentTarget.value);
            }}
          />
        </div>
        <button
          className={`mr-2 mt-8 flex items-center justify-center bg-teal-500 p-2 outline-0 hover:bg-teal-600 ${
            isProceed ? "pointer-events-none" : ""
          }`}
          onClick={submitHandler}
        >
          {isProceed ? "Proceeding..." : "Sign In"}
          {isProceed && (
            <span>
              <LoaderIcon className="m-0 h-6 w-6 fill-white" />
            </span>
          )}
        </button>
        <div className="mt-4 flex w-full justify-center">
          <GitHubIcon
            className={`${
              isProceed ? "pointer-events-none" : ""
            } transition-none hover:cursor-pointer hover:fill-neutral-500`}
            onClick={gitHubSignIn}
          />
          <GoogleIcon
            className={`${
              isProceed ? "pointer-events-none" : ""
            } transition-none hover:cursor-pointer hover:fill-blue-400`}
            color="info"
            onClick={googleSignIn}
          />
        </div>
        <Link
          className="mt-auto w-full text-center text-xs text-cyan-900 hover:cursor-pointer hover:text-orange-400 sm:text-sm"
          href="/signup"
        >
          Don't have an account?
        </Link>
      </form>
      <Waves className="z-1 absolute -bottom-28 overflow-hidden opacity-50 md:-bottom-36" />
    </div>
  );
};

SignIn.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>;
};

export default SignIn;
