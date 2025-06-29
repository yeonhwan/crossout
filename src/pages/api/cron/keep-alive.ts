// every 10 minutes

// NOT WORKING FOR HOBBY PLAN
// export const config = {
//   runtime: "edge",
// };
//
// const GET = (request: Request) => {
//   console.log("Warm up the server to prevent cold start");
//
//   // validation
//   if (!process.env.CRON_SECRET) {
//     throw new Error("Secret is not provided");
//   }
//
//   if (
//     request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
//   ) {
//     return new Response("Not Authorized", { status: 401 });
//   }
//
//   return new Response("Process completed", { status: 200 });
// };
//
// export default GET;
