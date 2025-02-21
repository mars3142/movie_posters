import {cinema} from './cinema.js';
import {wall} from './wall.js';

import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

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
