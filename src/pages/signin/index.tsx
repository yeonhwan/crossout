// Next
import { useRouter } from "next/navigation";
import Link from "next/link";

// React, hooks
import { useState } from "react";

//ICONS
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import LoaderIcon from "public/icons/spinner.svg";

// NextAuth
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";

// type
import { type NextPageWithLayout } from "@/pages/_app";

// styles
import form_styles from "@/styles/form.module.css";
import { type Session } from "next-auth";

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
    <div className="flex h-full w-full items-center justify-center">
      <form className="flex h-max w-[85%] flex-col rounded-lg border-2 border-zinc-300 p-12 sm:w-4/12">
        <h1 className="mb-5 w-full text-center text-base font-bold sm:text-xl">
          Sign In
        </h1>
        <p id="err_message" className="text-xs text-red-600 sm:text-base">
          {errMessage}
        </p>
        <label
          className="mt-4 text-sm font-bold text-gray-700 sm:text-base"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="type in your email"
          className="p-2"
          value={emailInput}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setEmailInput(e.currentTarget.value);
          }}
        />
        <label
          className="mt-4 text-sm font-bold text-gray-700 sm:text-base"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="type in your password"
          className="p-2"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setPasswordInput(e.currentTarget.value);
          }}
        />
        <button
          className={`mr-2 mt-8 flex items-center justify-center p-2 ${
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
            } hover:cursor-pointer`}
            onClick={gitHubSignIn}
          />
          <GoogleIcon
            className={`${
              isProceed ? "pointer-events-none" : ""
            } hover:cursor-pointer`}
            color="info"
            onClick={googleSignIn}
          />
        </div>
        <Link
          className="w-full text-center text-sm text-cyan-900 hover:cursor-pointer hover:text-orange-400 sm:text-base"
          href="/signup"
        >
          Don't have an account?
        </Link>
      </form>
    </div>
  );
};

SignIn.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>;
};

export default SignIn;
