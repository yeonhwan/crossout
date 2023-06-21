// Next
import { useRouter } from "next/navigation";
// ICONs
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import LoaderIcon from "public/icons/spinner.svg";
import LogoSimple from "public/logo/logo_simple.svg";
import Waves from "public/icons/waves.svg";

// types
import { type NextPageWithLayout } from "@/pages/_app";

// Next-Auth
import { signIn } from "next-auth/react";

// React, hooks
import { useState, useEffect } from "react";

// styles
import form_styles from "@/styles/form.module.css";

// api
import { api } from "@/utils/api";

// validation messages
import {
  EMAIL_ERR_MESSAGE,
  PWD_ERR_MESSAGE,
  CONFIRM_ERR_MESSAGE,
  INPUT_VALIDATION,
  USERNAME_ERR_MESSAGE,
} from "@/utils/validation_msg";

const SignUp: NextPageWithLayout = () => {
  const [isProceed, setIsProceed] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailStatus, setEmailStatus] = useState(INPUT_VALIDATION.EMPTY);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(INPUT_VALIDATION.EMPTY);
  const [confirmInput, setConfirmInput] = useState("");
  const [confirmStatus, setConfirmStatus] = useState(INPUT_VALIDATION.INVALID);
  const [errMessage, setErrMessage] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(INPUT_VALIDATION.EMPTY);
  const router = useRouter();

  // username validation

  useEffect(() => {
    setErrMessage("");
    if (!usernameInput.length) {
      setUsernameStatus(INPUT_VALIDATION.EMPTY);
      return;
    }

    if (usernameInput.length > 20) {
      setUsernameStatus(INPUT_VALIDATION.INVALID);
      return;
    }

    setUsernameStatus(INPUT_VALIDATION.VALID);
  }, [usernameInput]);

  // email validation
  useEffect(() => {
    setErrMessage("");
    if (!emailInput.length) {
      setEmailStatus(INPUT_VALIDATION.EMPTY);
      return;
    }
    const EMAIL_REG_EXP = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    if (!EMAIL_REG_EXP.test(emailInput)) {
      setEmailStatus(INPUT_VALIDATION.INVALID);
      return;
    }

    setEmailStatus(INPUT_VALIDATION.VALID);
  }, [emailInput]);

  // password validation
  useEffect(() => {
    setErrMessage("");
    if (!passwordInput.length) {
      setPasswordStatus(INPUT_VALIDATION.EMPTY);
      return;
    }

    if (passwordInput.length < 6 || passwordInput.length > 16) {
      setPasswordStatus(INPUT_VALIDATION.INVALID);
      return;
    }
    const PASSWORD_REG_EXP = new RegExp(
      "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{6,16}$"
    );

    if (!PASSWORD_REG_EXP.test(passwordInput)) {
      setPasswordStatus(INPUT_VALIDATION.INVALID_CHARACTER);
      return;
    }

    setPasswordStatus(INPUT_VALIDATION.VALID);
  }, [passwordInput]);

  // confirm validation

  useEffect(() => {
    setErrMessage("");
    if (confirmInput !== passwordInput || !confirmInput.length) {
      setConfirmStatus(INPUT_VALIDATION.INVALID);
      return;
    }

    setConfirmStatus(INPUT_VALIDATION.VALID);
  }, [confirmInput, passwordInput]);

  const { mutate: submitUserInfo } = api.signup.signUp.useMutation({
    onSuccess: (res) => {
      const { userId } = res.data;
      setIsProceed(false);
      return router.push(`/signin`);
    },
    onError: (err) => {
      const formEl = document.querySelector<HTMLFormElement>("form");
      switch (err.data?.httpStatus) {
        case 403:
          setErrMessage(err.message);
          setIsProceed(false);
          formEl?.classList.add(form_styles.invalid as string);
          break;

        case 500:
          setErrMessage("Connecntion failed");
          setIsProceed(false);
          formEl?.classList.add(form_styles.invalid as string);
          break;

        default:
          break;
      }
    },
  });

  const gitHubSignIn = () => {
    setIsProceed(true);
    return signIn("github", { callbackUrl: "/oauth" });
  };

  const googleSignIn = () => {
    setIsProceed(true);
    return signIn("google", { callbackUrl: "/oauth" });
  };

  const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      usernameStatus === INPUT_VALIDATION.VALID &&
      emailStatus === INPUT_VALIDATION.VALID &&
      passwordStatus === INPUT_VALIDATION.VALID &&
      confirmStatus === INPUT_VALIDATION.VALID
    ) {
      setErrMessage("");
      setIsProceed(true);
      submitUserInfo({
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      });
    } else {
      setErrMessage(
        "Your sign up information is not in correct form, check your information."
      );
      const formEl = document.querySelector<HTMLFormElement>("form");
      formEl?.classList.add(form_styles.invalid as string);
      setTimeout(() => {
        formEl?.classList.remove(form_styles.invalid as string);
      }, 500);
    }
  };

  const inputFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputId = e.currentTarget.id;
    const infoEl = document.querySelector(
      `#${inputId}` + "_valid_info"
    ) as HTMLElement;
    infoEl.classList.remove("hidden");
  };

  const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputId = e.currentTarget.id;
    const infoEl = document.querySelector(
      `#${inputId}` + "_valid_info"
    ) as HTMLElement;
    infoEl.classList.add("hidden");
  };

  return (
    <div className="main_background relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-full bg-pattern bg-repeat opacity-40"></div>
      <form className="z-50 flex h-max w-[85%] max-w-[500px] flex-col rounded-lg border-2 border-zinc-300 bg-white p-12 shadow-lg sm:w-4/12 sm:min-w-[450px]">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex h-max w-full flex-col items-center justify-center hover:cursor-pointer"
        >
          <LogoSimple className="mb-2 h-8 w-8 self-center fill-none stroke-teal-400" />
          <p className="mb-2 self-center text-xs font-bold text-teal-500">
            CROSSOUT
          </p>
        </div>
        <h1 className="mb-5 w-full text-center text-base font-bold sm:text-xl">
          Sign Up
        </h1>
        <p id="err_message" className="text-xs text-red-600 sm:text-base">
          {errMessage}
        </p>
        <div className="group flex h-max w-full flex-col justify-center">
          <label
            className={`mt-2 text-sm font-bold text-gray-600 sm:text-base ${
              usernameStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:text-red-500"
                : "group-focus-within:text-teal-400"
            }`}
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            placeholder="username"
            className={`w-full p-2 ${
              usernameStatus !== INPUT_VALIDATION.VALID
                ? "outline-red-500"
                : "group-focus-within:outline-teal-400"
            }`}
            value={usernameInput}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setUsernameInput(e.currentTarget.value);
            }}
            onFocus={inputFocusHandler}
          />
        </div>
        <p id="username_valid_info" className="hidden text-red-600">
          {usernameStatus === INPUT_VALIDATION.EMPTY
            ? USERNAME_ERR_MESSAGE.NOT_EMPTY
            : usernameStatus === INPUT_VALIDATION.INVALID
            ? USERNAME_ERR_MESSAGE.INVALID_LENGTH
            : ""}
        </p>
        <div className="group flex h-max w-full flex-col justify-center">
          <label
            className={`mt-2 text-sm font-bold text-gray-600 sm:text-base ${
              emailStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:text-red-500"
                : "group-focus-within:text-teal-400"
            }`}
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="email"
            className={`w-full p-2 ${
              emailStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:outline-red-500"
                : "group-focus-within:outline-teal-400"
            }`}
            value={emailInput}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setEmailInput(e.currentTarget.value);
            }}
            onFocus={inputFocusHandler}
          />
        </div>
        <p id="email_valid_info" className={`hidden text-red-500`}>
          {emailStatus === INPUT_VALIDATION.EMPTY
            ? EMAIL_ERR_MESSAGE.NOT_EMPTY
            : emailStatus === INPUT_VALIDATION.INVALID
            ? EMAIL_ERR_MESSAGE.INVALID_FORM
            : ""}
        </p>
        <div className="group flex h-max w-full flex-col justify-center">
          <label
            className={`mt-2 text-sm font-bold text-gray-600 sm:text-base  ${
              passwordStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:text-red-500"
                : "group-focus-within:text-teal-400"
            }`}
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            className={`w-full p-2 ${
              passwordStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:outline-red-500"
                : "group-focus-within:outline-teal-400"
            }`}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setPasswordInput(e.currentTarget.value);
            }}
            onFocus={inputFocusHandler}
          />
        </div>
        <p id="password_valid_info" className="hidden text-red-500">
          {passwordStatus === INPUT_VALIDATION.EMPTY
            ? PWD_ERR_MESSAGE.NOT_EMPTY
            : passwordStatus === INPUT_VALIDATION.INVALID
            ? PWD_ERR_MESSAGE.INVALID_LENGTH
            : passwordStatus === INPUT_VALIDATION.INVALID_CHARACTER
            ? PWD_ERR_MESSAGE.INVALID_CHARACTER
            : ""}
        </p>
        <div className="group flex h-max w-full flex-col justify-center">
          <label
            className={`mt-2 text-sm font-bold text-gray-600 sm:text-base  ${
              confirmStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:text-red-500"
                : "group-focus-within:text-teal-400"
            }`}
            htmlFor="confirm"
          >
            Password Confirm
          </label>
          <input
            id="confirm"
            type="password"
            placeholder="confirm password"
            className={`w-full p-2 ${
              confirmStatus !== INPUT_VALIDATION.VALID
                ? "group-focus-within:outline-red-500"
                : "group-focus-within:outline-teal-400"
            }`}
            value={confirmInput}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setConfirmInput(e.currentTarget.value);
            }}
            onFocus={inputFocusHandler}
          />
        </div>
        <p id="confirm_valid_info" className="hidden text-red-500">
          {confirmStatus === INPUT_VALIDATION.INVALID
            ? CONFIRM_ERR_MESSAGE.NOT_SAME
            : ""}
        </p>
        <button
          className={`mr-2 mt-8 flex items-center justify-center bg-teal-500 p-2 outline-0 hover:bg-teal-600  ${
            isProceed ? "pointer-events-none" : ""
          }`}
          onClick={submitHandler}
        >
          {isProceed ? "Proceeding..." : "Sign Up"}
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
      </form>
      <Waves className="z-1 absolute -bottom-28 opacity-50 md:-bottom-36" />
    </div>
  );
};

SignUp.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>;
};

export default SignUp;
