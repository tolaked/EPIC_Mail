import express from 'express';
import bodyParser from 'body-parser';
import apiV1 from './routes/api/v1';
import apiV2 from './routes/api/v2';
import groups from './routes/api/v2';

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

app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);
app.use('/api/v2', groups);

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
