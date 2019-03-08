import express from 'express';
import bodyParser from 'body-parser';
import users from './routes/api/users';

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

app.use('/api/v1/auth', users);

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
