import { extendType, nonNull, stringArg } from "nexus";
import { create_user, find_user_by_uname } from "../utils/my_sql_ops/db_call";
import { MutationResponse } from "./utils";
import bcrypt from 'bcrypt';

export const UserSignupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: MutationResponse,
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        email: nonNull(stringArg()),
        full_name: nonNull(stringArg()),
        gender: stringArg(),
        age_range: stringArg(),
      },
      async resolve(_, args) {
        const {
          username, password, phone, email, full_name
        } = args;
        const gender = args?.gender;
        const age_range = args?.age_range;
        try{
          const existing_uname_check = await find_user_by_uname(username);
          if (existing_uname_check?.length) throw new Error("Username already exists!");
          const salt = bcrypt.genSaltSync(10);
          const hashed_password = bcrypt.hashSync(password, salt);
          await create_user({
            username,
            password: hashed_password,
            phone,
            email,
            full_name,
            gender,
            age_range
          });
          return {
            status: 201,
            error: false,
            message: "Success",
          };
        } catch(err: any) {
          console.error(err);
          return {
            status: 400,
            error: true,
            message: err?.message,
          };
        }
      }
    });
  }
});