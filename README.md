# EPIC_Mail

Epic mail is a web app that helps people exchange messages/ information over the internet.

[![Build Status](https://www.travis-ci.org/tolaked/EPIC_Mail.svg?branch=develop)](https://www.travis-ci.org/tolaked/EPIC_Mail)[![Coverage Status](https://coveralls.io/repos/github/tolaked/EPIC_Mail/badge.svg?branch=develop)](https://coveralls.io/github/tolaked/EPIC_Mail?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/2c0e4d35288f395bdc03/maintainability)](https://codeclimate.com/github/tolaked/EPIC_Mail/maintainability)

## Required Features

- User can sign up
- User can sign in
- Users can **get create or send an email**
- Users can **fetch all received emails**
- Users can **fetch all unread received emails**
- Users can **fetch all sent emails**
- Users can **fetch a specific email record**
- Users can **delete a specific email record**

## Technologies

- Node JS
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate & Coveralls

## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
- Git

To run:

```sh
git clone <https://github.com/tolaked/EPIC_Mail.git>
cd EPIC_Mail
npm install
npm start
```

## Testing

```sh
npm test
```

## API-ENDPOINTS

`- POST /api/v1/auth/signup Create a new user.`

`- POST /api/v1/auth/login login a user.`

`- POST /api/v1/messages Create or send an email.`

`- GET /api/v1/messages Get all received emails.`

`- GET /api/v1/messages/unread get all unread received emails.`

`- GET /api/v1/sent get all sent emails.`

`- GET /api/v1/messages/<:message-id> Get a specific user email record.`

`- DELETE /api/v1/messages/<:message-id> Delete a specific user email record.`

## Pivotal Tracker stories

[https://www.pivotaltracker.com/n/projects/2314455](https://www.pivotaltracker.com/n/projects/2314455)

## Template UI

You can see a hosted version of the template at [https://tolaked.github.io/EPIC_Mail/index.html](https://tolaked.github.io/EPIC_Mail/index.html)

### API

The API is currently in version 1 (v1) and is hosted at

[https://myepic-mail.herokuapp.com/](https://myepic-mail.herokuapp.com/)

## API Documentation

[https://myepic-mail.herokuapp.com/api-docs](https://myepic-mail.herokuapp.com/api-docs)

## Author

Akere Adetola
