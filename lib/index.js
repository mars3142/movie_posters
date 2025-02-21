import {cinema} from './cinema.js';
import {wall} from './wall.js';
import {start} from '@google-cloud/profiler';

import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

start({
  projectId: process.env.PROJECT_ID,
  serviceContext: {
    service: 'movie_posters',
    version: '1.0.0',
  },
}).then(v => {
  console.log('Profiler started!');
});

app.use(express.json());
app.use(cors());

app.use("/cinema", cinema.router);
app.use("/wall", wall.router);

app.get("/", (req, res) => {
  res.status(200).send({status: 'ok'});
})

app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`),
);
