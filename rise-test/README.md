# Rise Blog Service

RESTful API with Domain Driven Design

## Development Environment Setup

1. Make sure you have nvm, node v18.17.0 or LTS version of node installed
2. Install yarn - npm install -g yarn.

## Important Info on Tests

1. Ensure the values of the envs `PSQL_DATABASE_NAME` and `PSQL_TEST_DATABASE_NAME` are not the same. `PSQL_TEST_DATABASE_NAME` is the database used in the test environment and the database is cleared after each test case.

2. Ensure dependencies have been installed and ENV variables are set.

3. Run the tests with `yarn test`. 


## Documentation
Find the postman documentation [HERE](https://documenter.getpostman.com/view/16946617/2sAXxQfXw6)

## Docker support

**Prerequisites**

1. [Docker](https://www.docker.com/products/docker-engine) Community Edition v17 or higher

```sh
$ docker-compose up
```


## Quick Start
1. to clone the project `git clone https://github.com/solomon-prosperity/rise-vest-test.git`
2. Run `docker-compose up` and you are ready to go.  OR cd to the `rise-test` directory and do the steps below
3. install neccesary dependencies using `yarn install`
4. Add ENV variables. A template for the appropriate ENV can be found in the `.env.example` file
5. start the server locally using `yarn start:dev`
6. Access `http://localhost:<PORT>` and you're ready to go!
   > http://localhost:30007


## Overview 
- uses Node.js > v16
- written using ES6
- uses Yarn for package dependency management


## Database
- PostgreSQL - Main datastore


## Some Tech

- Express - Node Framweork

- Awilix - dependency resolution support powered by Proxy

- Nodemon - Use for development file reload.

- CORS - a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

- Http-status - Utility to interact with HTTP status code.

- pg - PostgreSQL driver for Nodejs.

- Dayjs - Parse, validate, manipulate, and display dates and times in JavaScript.

## Author
[Eravwuvieke Prosper Ilouoghene](https://www.linkedin.com/in/prosper-eravwuvieke-25b534163/)


## License
MIT License - fork, modify and use however you want.
