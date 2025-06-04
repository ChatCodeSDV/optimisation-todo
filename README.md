# Todo api optimisation

## Table of Contents

- [Todo api optimisation](#todo-api-optimisation)
  - [Table of Contents](#table-of-contents)
  - [Summary](#summary)
  - [Project members](#project-members)
  - [Instructions](#instructions)
    - [Prerequisites](#prerequisites)
    - [Installation and Usage](#installation-and-usage)
    - [Coding practices](#coding-practices)

## Summary

This repository contains a simple Todo API built with express and Typescript and uses different services in docker containers  :

- The project uses docker compose to launch all of the necessary services.
- It also uses PM2 in order to clusterize the API and handle process management in a single docker container.
- NGINX is used in order to load balance the requests between the different instances of the API from the front.
Redis manages caching and BullMQ does task queueing, with SQLite as the persistent database.
- A simple Apache html frontend is included to demonstrate the API usage, which can be accessed at `http://localhost:80`.
- Grafana and prometheus are included for monitoring and metrics collection and K6 is used for load testing the API.
- The API is designed to handle basic CRUD operations for todo items, with caching to improve performance and reduce database load. It supports idempotency for task queueing using BullMQ, ensuring that tasks are processed reliably without duplication.
- It has schema validation using ajv, uses express-rate-limiter to prevent abuse, compression with a gzip middleware, has logging with Winston, and open Telemetry for distributed tracing with Prometheus.
- Lastly it has JWT authentication for securing the API endpoints.

It was created as a learning project to understand how to build a simple API with caching, task queueing, and load balancing and overall API optimisation in a M2 Dev lesson at Sup De Vinci.

## Project members

Members of the class group project at Sup De Vinci :

- [@ChatCodeSDV](https://github.com/ChatCodeSDV) :
  - Mathieu MORGAT
  - Souria-Ranjinie VINGADASSAMY
  - Marine DENIS

## Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local development and running scripts)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [pnpm](https://pnpm.io/) (optional, for package management)

Make sure you have access to the command line and the necessary permissions to run Docker commands.

### Installation and Usage

To set up and run the Todo API optimisation project, follow these steps:

1. Clone the repository:

   ```bash
   git clone git@github.com:ChatCodeSDV/optimisation-todo.git
    cd optimisation-todo
    ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the services using Docker Compose:

   ```bash
   docker-compose up --build
   # Or using pnpm script
    pnpm docker:start
   ```

4. Access the API:

Open your web browser and navigate to `http://localhost:3000` to access the API. Or the load balancer at `http://localhost:80` to access the API through NGINX since it will load balance the requests to the different instances of the API.

### Coding practices

Try using lint commands :

```bash
pnpm lint
```

This will run ESLint to check for code quality and style issues. You can also use `pnpm lint:fix` to automatically fix some of the issues.

You can also format the code using Prettier:

```bash
pnpm format
```

This will format the code according to the project's style guidelines.
