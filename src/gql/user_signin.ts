import { extendType, nonNull, stringArg } from "nexus";
import { MutationAuthResponse } from "./utils";
import { err_return } from "./utils";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { create_jwt_token } from "./utils";

dotenv.config();

export const UserSigninMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signin", {
      type: MutationAuthResponse,
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, context) {
        const {username, password} = args;
        try {
          const db_resp = await context.prisma.users.findUniqueOrThrow({
            where: {
              username,
            },
            select: {
              password: true,
            },
          });
          const { password: hashed_password } = db_resp;
          //Needed the check below because Typescript is too dumb to realize that findUniqueorThrow would throw if hashed_password is null
          const pw_match = hashed_password ? await bcrypt.compare(password, hashed_password) : false;
          if (!pw_match) throw {
            status: 401,
            message: "Invalid password!"
          }
          const token = create_jwt_token(username);
          return {
            status: 200,
            error: false,
            message: "Success",
            data: {
              token,
            },
          }
        } catch (err: any) {
          console.error(err?.message);
          return err_return(err?.status, err?.message);
        }
      }
    });
  }
})