import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Oauth = () => {
  const session = useSession();
  const router = useRouter();

  const { mutate: setUsername } = api.user.setUsername.useMutation({
    onSuccess: ({ data }) => {
      const username = data.username;
      router.push(`${username as string}/home`);
    },
    onError: () => {
      router.push("/signin");
    },
  });

  useEffect(() => {
    const name = session.data?.user.name;
    if (name) {
      if (name.length > 20) {
        const newName = name.slice(0, 19);
        setUsername({ data: { username: newName } });
      }

      router.push(`${name}/home`);
    }
  });

  return <div></div>;
};

export default Oauth;
