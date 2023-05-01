import { objectType } from "nexus";

export const MutationAuthResponse = objectType({
    name: "MutationResponse",
    definition(t) {
        t.nonNull.int("status");
        t.nonNull.boolean("error");
        t.nonNull.string("message");
        t.string("token");
    },
});

export const err_return = (status = 400, message: string) => {
  return {
    status,
    error: true,
    message,
  }
}