'use strict';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './router';

const app: Express = express();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// enable cors
app.use(cors());
app.options('*', cors());

// welcome message
app.get('/', async (_: Request, res: Response) => {
  return res.json({ message: 'Welcome to API ' });
});

// api routes a
app.use('/api', router);

app.listen(4000, () => {
  console.log('listening for requests on port 4000');
});
