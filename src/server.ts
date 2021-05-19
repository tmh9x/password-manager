import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { readCredentials, writeCredentials } from './utils/credentials';
import { connectDatabase } from './utils/database';

if (process.env.MONGO_URL === undefined) {
  throw new Error('Missing env MONGO_URL');
}

const app = express();
const port = 5000;

// server bekommt fähigkeit json daten zu verarbeiten
app.use(express.json());

app.get('/api/credentials', async (_request, response) => {
  const credentials = await readCredentials();
  response.json(credentials);
});

app.post('/api/credentials', async (request, response) => {
  await request.body;
  writeCredentials(request.body);
  response.json('Credential added');
});

// app.delete('/api.credentials/:service'),
//   (request, response) => {
//     response.send('Delete credential');
//   };

connectDatabase(process.env.MONGO_URL).then(() => {
  console.log('Database connected');
  app.listen(port, () => {
    console.log(`password-manager listening at http://localhost:${port}`);
  });
});
