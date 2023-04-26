import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { type NextPageWithLayout } from "../_app";
import { signIn } from "next-auth/react";
import { useState } from "react";
import styles from "@/styles/loader.module.css";

const SignIn: NextPageWithLayout = () => {
  const [isProceed, setIsProceed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const gitHubSignIn = () => {
    setIsProceed(true);
    return signIn("github", { callbackUrl: "/" });
  };

  const googleSignIn = () => {
    setIsProceed(true);
    return signIn("google", { callbackUrl: "/" });
  };

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return signIn("credentials", {
      redirect: false,
      email: emailInput,
      password: passwordInput,
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form className="flex h-max w-4/12 flex-col rounded-lg border-2 border-zinc-300 p-12">
        <h1 className="mb-5 w-full text-center text-xl font-bold">Sign In</h1>
        <label className="mt-2" htmlFor="email">
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
        <p className="text-red-500">this goes input verification status</p>
        <label className="mt-2" htmlFor="password">
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
        <p className="text-red-500">this goes input verification status</p>
        <button
          className={`mr-2 mt-8 flex items-center justify-center p-2 ${
            isProceed ? "pointer-events-none" : ""
          }`}
          onClick={submitHandler}
        >
          {isProceed ? "Proceeding..." : "Sign In"}
          {isProceed ? (
            <span className="flex items-center justify-center">
              <span className={`ml-2 ${styles.loader as string}`} />
            </span>
          ) : (
            ""
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
          className="w-full text-center text-cyan-900 hover:cursor-pointer hover:text-orange-400"
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
