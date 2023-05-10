# Pusleapp

- Local setup:
  - Run `yarn` to install deps
  - Setup a mysql db locally, create a .env file with the keys in .env.local and add your DB url under DATABASE_URL
  - Run `yarn migrate:deploy`
  - Add a value for the JWT_SECRET_KEY env variable
  - Run `yarn dev`
  - Make graphql requests to `http://localhost:4000/` (Request an invite to the Postman workspace for templates)