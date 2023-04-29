import { objectType } from "nexus";

export const MutationResponse = objectType({
    name: "MutationResponse",
    definition(t) {
        t.nonNull.int("status");
        t.nonNull.boolean("error");
        t.nonNull.string("message");
    },
});