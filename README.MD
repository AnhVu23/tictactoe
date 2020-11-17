# Tictactoe

- Live version: https://tiktaktoe2901.herokuapp.com/
- Documentation: https://tiktaktoe2901.herokuapp.com/api-docs

## Features
- **PvC tictactoe:** Playing tictactoe in 3x3 dimens with computer
- **Multiple games:** Playing multiple games at the same time
- **Game history:** All games will be saved.
- **Delete game** Don't want to save your game? Remove it from your history

## Upcoming feature

- **PvP tictactoe**
- **Bigger dimensions**

## Installation

- Clone the app: `git clone git@github.com:AnhVu23/tictactoe.git`
- Create an .env file (Check the sample.env for detailed information)
- For Linux, you can run `yarn docker-compose` or `npm run docker-compose` to run the app. It will create a Postgres database and a pgadmin browser.
- For MacOS and Window, run `yarn install` or `npm install` to install dependencies. Then `yarn dev` or `npm run dev` to start local server.

## Technology

- **NodeJS and Express**
- **REST API**
- **PostgreSQL**
- **Typeorm**: Object-relational mapping for Typescript
- **Docker**
- **Swagger**
- **Code formatter**: tslint, prettier and husky.


## Architecture: MVC

**MVC** stands for Model, View, Controller.

**Model:** This holds the data of the application. It cannot directly talk to the View. Generally, it’s recommended to expose the data to the Controller.

**View:** It represents the UI (REST API) of the application devoid of any Application Logic.

**Controller:** It acts as an interface between the Model and the View.

![Login](https://miro.medium.com/proxy/0*Qf1s2lG86MjX-Zcv.jpg)
