# Pusleapp

- Local setup:
  - Run `yarn` to install deps
  - Setup a mysql db locally, create a .env file with the keys in .env.local and add your DB url under DATABASE_URL
  - Run `yarn migrate:deploy`
  - Add a value for the JWT_SECRET_KEY env variable
  - Run `yarn dev`
  - Make graphql requests to `http://localhost:4000/` (Request an invite to the Postman workspace for templates)

Quirks
- When creating an entry in the points db table, ALWAYS add an entry for the `total` field by looking up the total value from the last entry into the table and adding it to the new number of points being assigned to the user(fan). This ensures that we don't have to do a multi row lookup everytime we need to get a user's total number of points.