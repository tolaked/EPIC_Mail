import express from 'express';
import bodyParser from 'body-parser';
import users from './routes/api/users';
import usersV2 from './routes/api/users-v2';
import messagesV2 from './routes/api/messages-v2';
import messages from './routes/api/messages';

const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Home route
app.get('/', (req, res) => res.status(200).json({
  status: 200,
  data: [
    {
      message: 'Welcome to Epic Mail',
    },
  ],
}));

// API version 1
app.use('/api/v1/auth', users);
app.use('/api/v1', messages);

// API version 2
app.use('/api/v2/auth', usersV2);
app.use('/api/v2', messagesV2);

// nonexistent route
app.all('*', (req, res) => res.status(404).json({
  status: 404,
  data: [
    {
      message: 'Route does not exist',
    },
  ],
}));
const port = process.env.PORT || 5000;
app.listen(port);

export default app;
