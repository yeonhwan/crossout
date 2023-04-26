import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { type NextPageWithLayout } from "../_app";
import { signIn } from "next-auth/react";
import { useState } from "react";
import styles from "@/styles/loader.module.css";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const SignUp: NextPageWithLayout = () => {
  const [isProceed, setIsProceed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmInput, setConfirmInput] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const router = useRouter();

  /**
   * TODO
   * 1. Make a Form Validation
   * 1-1. is a Email not empty ?
   * 1-2. is a Email correct Email Form ?
   * 1-3. is a password over 8 characters?
   * 1-4. is a password strong enough?
   * 1-5. is password & password confirm same?
   *
   * After that, send a request
   *
   * 2. Make a client side react to backend errors
   * 2-1. add little animation
   *
   */

  const { mutate: submitUserInfo } = api.signup.signUp.useMutation({
    onSuccess: (res) => {
      const { userId } = res.data;
      setIsProceed(false);
      return router.push(`/signup/${userId}`);
    },
    onError: (err) => {
      switch (err.data?.httpStatus) {
        case 403:
          setErrMessage(err.message);
          setIsProceed(false);
          break;

        case 500:
          setErrMessage("Connecntion failed");
          setIsProceed(false);
          break;

        default:
          break;
      }
    },
  });

  const gitHubSignIn = () => {
    setIsProceed(true);
    return signIn("github", { callbackUrl: "/" });
  };

  const googleSignIn = () => {
    setIsProceed(true);
    return signIn("google", { callbackUrl: "/" });
  };

  const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrMessage("");
    setIsProceed(true);
    submitUserInfo({ email: emailInput, password: passwordInput });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form className="flex h-max w-4/12 flex-col rounded-lg border-2 border-zinc-300 p-12">
        <h1 className="mb-5 w-full text-center text-xl font-bold">Sign Up</h1>
        <p className="text-red-600">{errMessage}</p>
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
        <label className="mt-2" htmlFor="pwconfirm">
          Password Confirm
        </label>
        <input
          id="pwconfirm"
          type="password"
          placeholder="confirm your password"
          className="p-2"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setConfirmInput(e.currentTarget.value);
          }}
        />
        <p className="text-red-500">this goes input verification status</p>
        <button
          className={`mr-2 mt-8 flex items-center justify-center p-2 ${
            isProceed ? "pointer-events-none" : ""
          }`}
          onClick={submitHandler}
        >
          {isProceed ? "Proceeding..." : "Sign Up"}
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
      </form>
    </div>
  );
};

SignUp.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>;
};

export default SignUp;
