// Hooks
import { useState, useEffect } from "react";

// Components
import Switch from "@/components/Switch/Switch";
import CircleButton from "@/components/Buttons/CircleButton";
import Layout from "@/components/Layout";
import { signOut } from "next-auth/react";

// Icons
import LightModeIcon from "@mui/icons-material/LightMode";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import NatureIcon from "public/icons/mountain.svg";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LoaderIcon from "public/icons/spinner.svg";

// Types
import { type UserDataState } from "@/types/client";
import { type InferGetServerSidePropsType } from "next";

// GSSP
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "@/server/api/trpc";
import withSession from "@/utils/withSession";

// validation messages
import { INPUT_VALIDATION, USERNAME_ERR_MESSAGE } from "@/utils/validation_msg";

// api
import { api } from "@/utils/api";

export const getServerSideProps = withSession<{
  props: {
    data: UserDataState;
  };
}>(async (session) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });
  const userData = await helpers.user.getUserData.fetch();

  return {
    props: userData,
  };
});

const Preference = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { preference, username } = data;
  const [lightMode, setLightMode] = useState(preference.isLight);
  const [background, setBackground] = useState(preference.background);
  const [isEditUsername, setIsEditUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);
  const [usernameStatus, setUsernameStatus] = useState(INPUT_VALIDATION.VALID);

  const { mutate } = api.user.setUserPreference.useMutation({
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: setUsername, isLoading } = api.user.setUsername.useMutation({
    onSuccess: ({ data }) => {
      const username = data.username;
      setUsernameInput(username);
      setIsEditUsername(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteUser } = api.user.deleteUser.useMutation({
    onSuccess: () => {
      window.alert("Successfully deleted. Thanks for using");
      return signOut({ callbackUrl: "/" });
    },
    onError: (err) => {
      throw new Error("Cannnot delete");
    },
  });

  useEffect(() => {
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

  const currentUserData = {
    preference: {
      isLight: lightMode,
      background: background,
    },
    username: usernameInput,
  };

  return (
    <Layout userData={currentUserData}>
      <div className="relative flex h-full w-full flex-col items-center px-28">
        <h1 className="text-4xl font-extrabold text-neutral-800 transition-colors dark:text-neutral-300">
          Preference
        </h1>
        <div className="relative mt-4 flex h-full max-h-[700px] w-1/3 flex-col justify-evenly rounded-xl bg-neutral-300/40 p-6 py-8 text-neutral-700 backdrop-blur-md transition-colors dark:bg-neutral-800/40 dark:text-neutral-200">
          <div className="mb-2 flex h-max w-full flex-col items-center justify-center">
            <div className="mb-2 flex items-center justify-center">
              <p className="text-lg font-extrabold">Username</p>
              {isEditUsername ? (
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <LoaderIcon className="h-10 w-10" />
                  ) : (
                    <>
                      <CircleButton
                        info="apply"
                        className={`ml-2 h-6 w-6 rounded-md ${
                          usernameStatus !== INPUT_VALIDATION.VALID
                            ? "pointer-events-none bg-neutral-400 dark:bg-neutral-500"
                            : "bg-emerald-400 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        } `}
                        onClick={() => {
                          setUsername({ data: { username: usernameInput } });
                        }}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </CircleButton>
                      <CircleButton
                        info="cancel"
                        className="ml-2 h-6 w-6 rounded-md bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
                        onClick={() => {
                          setIsEditUsername(false);
                          setUsernameInput(username);
                        }}
                      >
                        <ClearIcon className="h-4 w-4" />
                      </CircleButton>
                    </>
                  )}
                </div>
              ) : (
                <CircleButton
                  info="edit"
                  className={`ml-2 h-6 w-6 rounded-md bg-orange-300 p-0 hover:bg-orange-400 dark:bg-orange-400 dark:hover:bg-orange-500`}
                  onClick={() => {
                    setIsEditUsername(true);
                  }}
                >
                  <ModeEditOutlineIcon className="h-4 w-4" />
                </CircleButton>
              )}
            </div>
            <div className="flex h-max w-[70%] items-center justify-center px-6">
              {isEditUsername ? (
                <input
                  className={`rounded-md bg-neutral-300/40 ${
                    usernameStatus !== INPUT_VALIDATION.VALID
                      ? "focus:outline-2 focus:outline-red-400"
                      : "foucs:outline-2 focus:outline-cyan-500"
                  } p-2`}
                  value={usernameInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsernameInput(e.currentTarget.value);
                  }}
                  autoFocus
                />
              ) : (
                <p className="rounded-md bg-neutral-300/40 p-2">
                  {usernameInput}
                </p>
              )}
            </div>
            <p className="mt-2 text-xs text-red-400">
              {usernameStatus === INPUT_VALIDATION.EMPTY
                ? USERNAME_ERR_MESSAGE.NOT_EMPTY
                : usernameStatus === INPUT_VALIDATION.INVALID
                ? USERNAME_ERR_MESSAGE.INVALID_LENGTH
                : ""}
            </p>
          </div>
          <div className="flex h-max w-full flex-col items-center justify-center">
            <p className="text-lg font-extrabold">Theme</p>

            <p className="mb-2">{lightMode ? "Light" : "Dark"}</p>
            <Switch
              switchState={lightMode}
              toggleSwitch={() => {
                setLightMode(!lightMode);
                document.querySelector(".layout")?.classList.toggle("dark");
                mutate({ data: { isLight: !lightMode, background } });
              }}
              onIcon={<NightsStayIcon className="h-3 w-3 fill-white" />}
              offIcon={<LightModeIcon className="h-3 w-3 fill-white" />}
            />
          </div>
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p className="mb-2 text-lg font-extrabold">Background</p>
            <div className="flex h-full w-[50%] justify-evenly">
              <div
                onClick={() => {
                  setBackground("1");
                  mutate({
                    data: { isLight: lightMode, background: "1" },
                  });
                }}
                className={`flex h-[90%] w-max flex-col items-center justify-center rounded-md px-3 transition-colors ${
                  background === "1"
                    ? "pointer-events-none bg-neutral-300/50 dark:bg-neutral-400/50"
                    : "hover:cursor-pointer hover:bg-neutral-300/50"
                }`}
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-md transition-colors ${
                    background === "1"
                      ? "bg-cyan-500 dark:bg-cyan-600"
                      : "bg-neutral-400 dark:bg-neutral-700"
                  }`}
                >
                  <NatureIcon className="h-10 w-10 fill-white" />
                </span>
                <p
                  className={`font-semibold ${
                    background === "1"
                      ? "text-cyan-300"
                      : "text-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  nature
                </p>
              </div>
              <div
                onClick={() => {
                  setBackground("2");
                  mutate({
                    data: { isLight: lightMode, background: "2" },
                  });
                }}
                className={`flex h-[90%] w-max flex-col items-center justify-center rounded-md px-3 transition-colors ${
                  background === "2"
                    ? "pointer-events-none bg-neutral-300/50 dark:bg-neutral-400/50"
                    : "hover:cursor-pointer hover:bg-neutral-300/50"
                }`}
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-md transition-colors ${
                    background === "2"
                      ? "bg-cyan-500 dark:bg-cyan-600"
                      : "bg-neutral-400 dark:bg-neutral-700"
                  }`}
                >
                  <span className="h-10 w-10 rounded-md bg-neutral-300"></span>
                </span>
                <p
                  className={`font-semibold ${
                    background === "2"
                      ? "text-cyan-300"
                      : "text-neutral-700 dark:text-neutral-200"
                  }`}
                >
                  simple
                </p>
              </div>
            </div>
          </div>
          <p
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure want to delete your account? Every data will be permenantly deleted from application"
                )
              ) {
                deleteUser();
              }
            }}
            className="self-center rounded-md p-2 text-xs text-neutral-500 hover:cursor-pointer hover:bg-red-400 hover:text-red-600"
          >
            Delete Account
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Preference;
