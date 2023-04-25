import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { type NextPageWithLayout } from "../_app";

const SignUp: NextPageWithLayout = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <form className="flex h-max w-4/12 flex-col rounded-lg border-2 border-zinc-300 p-12">
        <h1 className="mb-5 w-full text-center text-xl font-bold">Sign Up</h1>
        <label className="mt-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="type in your email"
          className="p-2"
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
        />
        <p className="text-red-500">this goes input verification status</p>
        <button className="mt-8 p-2">Sign up</button>
        <div className="mt-4 flex w-full justify-center">
          <GitHubIcon />
          <GoogleIcon color="info" />
        </div>
      </form>
    </div>
  );
};

SignUp.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>;
};

export default SignUp;
