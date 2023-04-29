import { my_sql_queries } from "./queries";
import { execute_query } from "./db_conn";
import { User, DBReturn } from "../types";

export const create_user = async (payload:User) => {
  const {
    username, password, phone, email, full_name, gender, age_range,
  } = payload;
  const result = await execute_query<DBReturn>(my_sql_queries.create_user, [username, full_name, email, phone, password, gender, age_range]);
  return result?.affectedRows;
}

export const find_user_by_uname = async (payload: string) => {
  return execute_query<[]>(my_sql_queries.find_user_by_uname, [payload]);
}
