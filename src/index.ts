import {db_init} from './utils/my_sql_ops/db_conn';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { schema } from "./schema";

db_init();

export const startApolloServer = async() => {
  const server = new ApolloServer({
    schema,
  });
  const { url } = await startStandaloneServer(server, {});
  console.log(`🚀  Server ready at ${url}`);
}

startApolloServer();