# Teachingo API 🧠

Node.js service that powers the Teachingo Client 🚀

## Technology Stack

- [Node.js](https://nodejs.org/en/) (v12.16.2)
    - [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) Database (v12.2)
    - [Knex.js](https://knexjs.org/)

## Getting Started

To spin the service up locally, execute the following:

```bash
$ npm install
$ npm run start
```

This will start the service on port `8080` - verify that it is running by hitting `http://localhost:8080/api/status`.

---

On initial pull, you will also need to set up a PostgreSQL service locally running on port `5432` (default). I recommend using the official [Docker image](https://hub.docker.com/_/postgres) for this one.

Once you have it up and running, simply run the following to create the database:

```bash
$ psql -U postgres
$ CREATE DATABASE teachingo_db;
$ CREATE USER teachingo_admin WITH SUPERUSER;
$ ALTER USER teachingo_admin PASSWORD;
```

This will create the database and the custom user that will be used to interact with your local database. The last ALTER statement will prompt you to enter a new password for the database user, choose something secure and ensure to store it securely.

---

Create a `.env` file in the root directory and add the following:

```
LOCAL_DATABASE_PASSWORD={{Password you used when altering the user}}
```

---

Once you have the Postgres database set up and environment variable set, run the migrations to set up the schema:

```bash
$ npm run migrations
```

## License

See the [LICENSE](LICENSE) file for details.
