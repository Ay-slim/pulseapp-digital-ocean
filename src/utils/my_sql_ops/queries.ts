export const my_sql_queries = {
  create_user: `
  INSERT INTO users (username, full_name, email, phone, password)
    VALUES(?, ?, ?, ?, ?);
  `,
  find_user_by_uname: `
  SELECT username FROM users WHERE username = ?;
  `
}