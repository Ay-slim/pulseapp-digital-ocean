import { extendType, nonNull, stringArg, enumType } from "nexus";
import { MutationAuthResponse } from "./utils";
import bcrypt from "bcryptjs";
import { create_jwt_token } from "./utils";

const GenderEnum = enumType({
  name: 'GenderEnum',
  members: ["male", "female", "binary", "other"],
});

export const UserSignupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: MutationAuthResponse,
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        email: nonNull(stringArg()),
        full_name: nonNull(stringArg()),
        gender: GenderEnum,
        age_range: stringArg(),
      },
      async resolve(_, args, context) {
        const {
          username, password, phone, email, full_name
        } = args;
        const gender = args?.gender;
        const age_range = args?.age_range;
        try{
          const existing_uname_check = await context.prisma.users.findUnique({
            where: {
              username,
            },
            select: {
              username: true,
            }
          });
          if (existing_uname_check) throw new Error("Username already exists!");
          const salt = bcrypt.genSaltSync(10);
          const hashed_password = bcrypt.hashSync(password, salt);
          await context.prisma.users.create({data: 
            {
              username,
              password: hashed_password,
              phone,
              email,
              full_name,
              gender,
              age_range
            }
          });
          const token = create_jwt_token(username);
          return {
            status: 201,
            error: false,
            message: "Success",
            data: {
              token,
            }
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