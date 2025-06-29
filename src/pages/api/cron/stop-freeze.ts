export const config = {
  runtime: "edge",
};

// once a day
const GET = async (request: Request) => {
  // Auto sign in for stop pausing DB
  console.log("Trying to auto login with test account for stop DB freezing");

  try {
    if (!process.env.CRON_SECRET) {
      throw new Error("Secret is not provided");
    }

    // validation
    if (
      request.headers.get("Authorization") !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new Response("Not Authorized", { status: 401 });
    }

    // sign in
    const res = await signin({
      email: process.env.TEST_EMAIL as string,
      password: process.env.TEST_PW as string,
    });

    if (res && res.status >= 200 && res.status < 300) {
      return new Response("Process completed.");
    } else {
      const errorStatus = res?.status || 500;
      const reason = res?.statusText || "Unknown error occurred.";

      return new Response(`Login failed: ${reason}`, {
        status: errorStatus,
      });
    }
  } catch (e) {
    console.log(e);
    return new Response("Login failed. Check information and variables", {
      status: 500,
    });
  }
};

const signin = ({ email, password }: { email: string; password: string }) => {
  if (!process.env.NEXTAUTH_URL) {
    throw new Error("URL is not provided.");
  } else {
    // from source code
    return fetch(process.env.NEXTAUTH_URL + "/api/auth/callback/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }
};

export default GET;
