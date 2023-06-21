import Logo from "public/logo/logo_gradient.svg";
import MainTitle from "public/logo/main_title.svg";
import MainTitleHorizon from "public/logo/main_title_horizon.svg";
import LogoSimple from "public/logo/logo_simple.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "public/icons/google.svg";
import Waves from "public/icons/waves.svg";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { motion } from "framer-motion";

// GSSP
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/auth";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/myapp/home",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};

const Splash = () => {
  const router = useRouter();

  return (
    <div className="main_background relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute left-0 top-0 z-0 h-full w-full bg-pattern bg-repeat-round opacity-40"></div>
      <div className="z-10 flex h-full w-full items-center justify-center mobile:h-[70%] mobile:w-[80%] lg:h-[80%] lg:w-[50%]">
        <div className="mt-10 flex h-0 w-0 items-center py-24 opacity-0 lg:h-full lg:w-[30%] lg:opacity-100">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-[80%] w-full flex-col items-center justify-center"
          >
            <MainTitle className="absolute bottom-0 h-72 w-72 fill-none" />
            <Logo className="h-48 w-48 fill-none lg:absolute lg:top-0" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="z-20 flex h-full w-full flex-col items-center justify-center lg:h-[80%] lg:w-1/2 lg:min-w-[400px]"
        >
          <div className="z-20 flex h-full w-[70%] flex-col items-center justify-center rounded-xl bg-transparent from-teal-400 to-cyan-500 lg:w-[90%] lg:bg-gradient-to-br lg:shadow-lg">
            <div className="flex h-full w-full max-w-[500px] flex-col justify-between py-10">
              <div className="flex h-[80%] w-full flex-col-reverse lg:h-[60%] lg:flex-col">
                <div className="hidden h-[40%] w-full flex-col items-center justify-center after:mt-4 after:h-1 after:w-[5%] after:border-b-2 after:border-b-white lg:flex">
                  <p className="text-sm font-semibold text-white">
                    Make Todos, Daylogs, Revenues.
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Manage all with calendar and charts.
                  </p>
                  <p className="text-sm font-semibold text-teal-200">
                    Cross them out with Crossout!
                  </p>
                </div>
                <div className="flex h-full flex-col items-center justify-center md:justify-around lg:h-[60%] lg:justify-evenly">
                  <div className="relative mt-auto flex h-[40%] w-full flex-col items-center md:h-[60%] lg:h-0 lg:w-0 lg:opacity-0">
                    <Logo className="absolute top-0 block h-32 w-32 fill-none md:h-48 md:w-48" />
                    <MainTitleHorizon className="absolute top-1/2 h-48 w-48 md:h-60 md:w-60" />
                  </div>
                  <LogoSimple className="hidden h-24 w-24 fill-none stroke-cyan-300 lg:block" />
                  <div className="mt-auto flex h-[10%] w-full flex-col items-center justify-center lg:h-[30%]">
                    <h1 className="hidden self-center text-3xl font-bold text-cyan-200 lg:block">
                      CROSSOUT
                    </h1>
                    <h2 className="self-center text-xs font-bold text-cyan-200 md:text-sm lg:text-xs">
                      Your simple day to day manager application
                    </h2>
                  </div>
                </div>
              </div>
              <div className="flex h-[30%] w-full flex-col items-center justify-evenly">
                <div
                  onClick={() => signIn("google", { callbackUrl: "/oauth" })}
                  className="flex h-12 w-[80%] items-center justify-center rounded-full bg-[#4285f4] drop-shadow-lg hover:cursor-pointer hover:ring-2 hover:ring-teal-300"
                >
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <GoogleIcon className="h-4 w-4" />
                  </span>
                  <p className="text-sm text-white">Sign in With Google</p>
                </div>
                <div
                  onClick={() => signIn("github", { callbackUrl: "/oauth" })}
                  className="flex h-12 w-[80%] items-center justify-center rounded-full bg-neutral-800 drop-shadow-lg hover:cursor-pointer hover:ring-2 hover:ring-teal-300"
                >
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <GitHubIcon className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-white">Sign in With Github</p>
                </div>
                <p
                  onClick={() => {
                    router.push("/signin");
                  }}
                  className="text-sm text-white hover:cursor-pointer hover:text-teal-200 lg:text-teal-700"
                >
                  Sign in with Email
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="z-1 absolute -bottom-28 flex h-full w-full items-center justify-center md:-bottom-40"
      >
        <Waves className="opacity-50" />
      </motion.div>
    </div>
  );
};

export default Splash;
