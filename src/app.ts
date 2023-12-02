import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.get('/api/test', async (req, res) => {
  res.status(200).send('Congratulations!Typescript API is working!');
});

export default app;
