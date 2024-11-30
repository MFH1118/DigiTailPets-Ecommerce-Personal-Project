import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const PORT = process.env.BACKEND_PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const run = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

run();