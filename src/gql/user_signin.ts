import { extendType, nonNull, stringArg } from "nexus";
import { find_user_pw_by_uname } from "../utils/my_sql_ops/db_call";
import { MutationAuthResponse } from "./utils";
import { err_return } from "./utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
      async resolve(_, args) {
        const {username, password} = args;
        try {
          const db_resp = await find_user_pw_by_uname(username);
          if (!db_resp?.length) throw {
            status: 400,
            message: "Username not found!",
          };
          const { hashed_password } = db_resp?.[0];
          const pw_match = await bcrypt.compare(password, hashed_password);
          if (!pw_match) throw {
            status: 401,
            message: "Invalid password!"
          }
          const jwt_secret = process.env.JWT_SECRET_KEY;
          const token = jwt_secret ? jwt.sign({username}, jwt_secret) : "";
          if (!token) throw {
            status: 400,
            messsage: "Undefined JWT secret!"
          }
          return {
            status: 200,
            error: false,
            message: "Success",
            token,
          }
        } catch (err: any) {
          console.error(err?.message);
          return err_return(err?.status, err?.message);
        }
      }
    });
  }
})