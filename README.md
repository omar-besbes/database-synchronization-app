# Database Synchronization System

![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Overview

This repository contains the source code for a distributed database synchronization system designed for organizations
with multiple offices, such as banks or retail chains. The system consists of two applications: one representing the
head office (HO) and the other for branch offices (BO). The system utilizes RabbitMQ as a messaging broker to facilitate
communication and synchronization between the head office and branch offices.

## Features

- Synchronization of databases across multiple offices in real-time.
- Automatic synchronization upon internet outage recovery.
- Highly available and fault-tolerant messaging infrastructure using RabbitMQ.
- Support for dynamic schema evolution.

## Project Structure

The project follows a monorepo style structure, organized into the following directories:

- `apps/`: Contains the source code for both the head office and branch office applications.
    - `apps/head/`: Source code for the head office application.
    - `apps/branch/`: Source code for the branch office application.

- `docs/`: Contains other relevant documentation apart from the README.md.

- `libs/`: Contains modules that are shared between the two applications.

- `scripts/`: Contains various scripts required to start the entire system.

## How it works ?

### Head Office Application

The head office application serves as the central hub for database synchronization. It communicates with branch offices
and manages the synchronization process. Deploying one instance of the head office application is sufficient to
synchronize data with multiple branch offices.

### Branch Office Application

The branch office application represents individual offices that synchronize their databases with the head office.
Multiple instances of the branch office application can be deployed to synchronize data from different locations.

## Installation and Setup

First, clone the repository.

```sh
git clone https://github.com/omar-besbes/database-synchronization-app.git
```

<details> 
<summary> Using `docker compose` (Recommended) </summary>

> The installation process has been thoroughly tested on a Debian machine and is expected to work smoothly on all Unix-based systems. <br>
> However, it is important to note that compatibility with other operating systems, such as Windows, cannot be guaranteed.

To get our system up and running, please run this:

```sh
./scripts/generate_secrets.sh > .env
./scripts/generate_ssl_certificates.sh >> .env
docker compose up
```

This will generate a `.env` file containing the necessary credentials and ssl certificates in order for the databases to start.


</details>

<details> 
<summary> Manually </summary>

I don't have any idea why someone would want to start the whole system manually.
For the sake of completeness, here it is.

We will first show how to set up a HO and a single BO and then how to add other BO.

### Starting the system with a single branch office

1. Install dependencies

```sh
yarn
```

2. Configure the application settings

- make sure you have a relational database up and running for each office you plan on running.
- make sure you have a RabbitMQ instance up and running. You can find out how to install and set up a RabbitMQ instance
  locally [here](https://rabbitmq.com), or you can use managed RabbitMQ instance [here](https://www.cloudamqp.com).
- use the `.env.example` files (there is one in `apps/head` for the head office and one in `apps/branch` for branch
  offices) to generate `.env` for each office. Put them besides the corresponding `.env.example` files.

3. Build & start the applications

```sh
# build step
# you only have to run this once for all offices
yarn build head && yarn build branch
# start step
# you have to run these in separate shell sessions
yarn start head # start the HO
yarn start branch # start a BO
```

### Adding branch offices

This is the tricky part, we can not use the same `.env` for all branch offices. The environment variables are crucial
for how the whole system will work. So, to use multiple branch offices, we have to start them one by one. For each one,
we change the `.env` file and start a new branch office. Notice that changing the `.env` will not affect the already
running instances as environment variables are loaded at startup and are never checked afterward. This is also why it is
important to wait for the branch office app to start before moving on to another.

</details>

## Deployment Considerations

- Ensure proper network connectivity between the head office and branch offices.
- Configure RabbitMQ for high availability and fault tolerance.
- Implement security measures to protect data during transmission and storage.

## Forking and Customization

If you intend to fork this project and customize it to your needs, here are some considerations:

### Database Agnosticism

The codebase is designed to be database agnostic for **relational** databases. This means that
theoretically, each office could use a different SQL database without encountering major compatibility issues.
However, it's important to note that this feature has not been tested.

To minimize risk and ensure proper functionality, it's recommended to conduct thorough testing when deploying the system
with different RDBMS systems.

Additionally, any specific database-related configurations or queries should be carefully reviewed and adjusted as
needed to ensure compatibility with the chosen database platform. Although, in my opinion, if changing to different
RDBMS systems will require having changes to queries, making this change defeats the whole purpose of having a single
code for multiple instances.

## Contributing

Contributions are welcome! Please clone the repository, make your changes, and submit a pull request.
