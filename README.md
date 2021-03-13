# shyless-server

Server side for Shyless, a web application for asking questions annonimously (or not). Using MERN Stack.

## Installation

```
$ git clone https://github.com/Yrkan/shyless-server
$ cd shyless-server
$ yarn install
```

## Configuration

1- Inside the shyless-server folder create a **config** folder

```
$ mkdir config
```

2- Inside config create **default.json** file with the following content

```json
{
  "databaseURL": "link to your MongoDB database",
  "jwtKey": "a very secret key"
}
```

I suggest using a free [MongoDB Atlas](https://account.mongodb.com/account/login) cloud database if you can't or don't want to install MongoDB locally.

## Running

```
$ yarn start:dev
```
