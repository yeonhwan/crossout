import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthLoader from "public/icons/auth_loading.svg";

const Oauth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCalled, setIsCalled] = useState(false);

  const { mutate: setUsername } = api.user.setUsername.useMutation({
    onSuccess: () => {
      console.log("called5");
      router.push("myapp/home");
      return;
    },
    onError: () => {
      router.push("/signin");
      return;
    },
  });

  useEffect(() => {
    const name = session?.user.name;
    if (isCalled) return;
    if (status === "unauthenticated") {
      router.push("/");
      setIsCalled(true);
    }
    if (name && status === "authenticated") {
      if (name.length > 20) {
        const newName = name.slice(0, 19);
        setUsername({ data: { username: newName } });
      } else {
        router.push("myapp/home");
        setIsCalled(true);
      }
    }
  }, [status, session, isCalled]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="relative flex h-[8%] w-max flex-col items-center justify-center mobile:h-[10%]">
        <h1 className="absolute top-0 ml-1 animate-bounce text-xs font-bold text-neutral-400 mobile:text-base">
          Login...
        </h1>
        <AuthLoader className="absolute bottom-0 h-14 w-14 mobile:h-20 mobile:w-20 sm:h-28 sm:w-28" />
      </div>
    </div>
  );
};

export default Oauth;
