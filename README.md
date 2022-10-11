# DEMO CREDIT API

### ABOUT
Demo Credit is an API with wallet functionality. It allows users do the following:

* Register
* Create a wallet account
* Fund their wallet account
* Withdraw funds from their wallet account
* Transfer funds to another user’s wallet account

### TECH STACK

* TypeScript
* Node.js
* Express
* MySQL
* Knex (ORM)

### SETUP
Once the repo is cloned, you will need to create a .env file based on the .env.example committed with the project.

Running ``cp .env.example .env`` on the root directory should do the trick on a POSIX based system. After that, you just need to replace the values used.

To install dependencies, run:
```
yarn
```

To get the dev server running, run:
```
yarn dev
```
This automatically runs all unapplied database migrations inside ./src/db/migrations as well as starts up the dev server.

If need be, to undo migrations run:
```
yarn rollback
```

Creating a file for your own migration is as easy as running:
```
yarn knex migrate:make name_of_migration --knexfile ./src/db/config.ts
```

This should be done at the root directory of the project otherwise the path to the knexfile config would need to be adjusted. Also once you have implemented your migration, remember to run:
```
yarn migrate
```

To run tests, use:

```
yarn test
```

To build the project and generate JavaScript Files, run:

```
yarn build
```

This will generate a dist folder which you can also use the startup the server and apply recent migrations by running:

```
yarn start
```

## ERD

![Diagram](./demo_credit_erd.png)

## API URL

visit [here](https://caleb-oneyemi-lendsqr-be-test-hspxj.ondigitalocean.app/)

## API DOCUMENTATION

visit [here](https://documenter.getpostman.com/view/19108910/2s83zjsiiQ)
