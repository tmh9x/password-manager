import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { readCredentials } from './utils/credentials';
import { connectDatabase } from './utils/database';

if (process.env.MONGO_URL === undefined) {
  throw new Error('Missing env MONGO_URL');
}

const app = express();
const port = 5000;

app.get('/api/credentials', async (_request, response) => {
  const credentials = await readCredentials();
  response.json(credentials);
});

app.post('/api/credentials', (_request, response) => {
  response.send('Add new credential');
});

connectDatabase(process.env.MONGO_URL).then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`Cryptarch listening at http://localhost:${port}`);
  });
});
