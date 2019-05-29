import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiV1 from './routes/api/v1';
import apiV2 from './routes/api/v2';
import groups from './routes/api/v2';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

const swaggerDocument = YAML.load(`${__dirname}/../swagger.yaml`);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.use(
  cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.use(cors());

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
