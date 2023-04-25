import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn: NextPage = () => {
  const [emailInput, setEmailInput] = useState<string>("");

  const signInWGitHub = async () => {
    const res = await signIn("github");
    console.log(res);
  };

  const signInWEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("email", { email: emailInput });
    // console.log(res);
  };

  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setEmailInput(e.currentTarget.value);
  };

  return (
    <div>
      <h1>signIn</h1>
      <form>
        <label htmlFor="email">your email</label>
        <input
          value={emailInput}
          onChange={inputHandler}
          id="email"
          type="email"
        />
        {/* <label htmlFor="password">your password</label> */}
        <button onClick={signInWEmail}>submit</button>
      </form>
      <button onClick={() => signInWGitHub()}>sign in with gitHub</button>
    </div>
  );
};
