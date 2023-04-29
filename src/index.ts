import {db_init} from './utils/my_sql_ops/db_conn';
import { ApolloServer } from "apollo-server";

import { schema } from "./schema";
export const server = new ApolloServer({
    schema,
});

db_init();

const port = 3000;

server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

import {find_user_by_uname} from './utils/my_sql_ops/db_call';

//find_user_by_uname('nothing');