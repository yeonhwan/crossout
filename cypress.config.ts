import { defineConfig } from "cypress";
import { PrismaClient } from "@prisma/client";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async dbResetForSignUp({ email }: { email: string }) {
          const prisma = new PrismaClient();
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            try {
              const result = await prisma.user.delete({ where: { email } });
              console.log("successfuly deleted");
              return !!result;
            } catch (err) {
              console.log(err, "can not delete");
            }
          }
          console.log("user does not exist");
          return null;
        },
      });
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
