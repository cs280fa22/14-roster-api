# Roster API

The Roster API allows authentication and authorization over CRUD operations for
a classroom roster.

## Run locally

1. Clone this repository.
2. Create a `.env` file in the root folder.
3. Create a MongoDB Cluster and store its connection URI in a variable `DB_URI` in the `.env` file.
4. Add a `DB_TEST_URI` to the `.env` using the same connection URI but a different database name.
5. Open the terminal at the root of the repository.
6. Install dependencies with `yarn install`
7. Run the app with `yarn dev`
