import {cinema} from './cinema.js';
import {createPoster} from "./common.js";
import {start} from '@google-cloud/profiler';
import Joi from 'joi';

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
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({status: 400, message: err.message}); // Bad request
    }
    next();
});

app.use("/cinema", cinema.router); /// legacy - can be removed later

app.get("/", (req, res) => {
    res.status(200).send({status: 'use POST method'});
})

const schema = Joi.object({
    width: Joi.number().min(0),
    height: Joi.number().min(0),
    count: Joi.number().min(0),
    orientation: Joi.string().valid('horizontal', 'vertical'),
    shuffle: Joi.boolean(),
    backgroundColor: Joi.string().regex(/^#[a-fA-F0-9]{3,6}$/).message("The value of 'backgroundColor' has to be a valid hexadecimal color code"),
});

const validate = (req, res, next) => {
    const {error} = schema.validate(req.body);

    if (error) {
        return res.status(400).send({"error": error.details[0].message});
    }

    next();
};
app.post("/", validate, async (req, res) => {
    const width = req.body.width ?? 480;
    const height = req.body.height ?? 320;
    const count = req.body.count ?? 3;
    const orientation = req.body.orientation ?? 'horizontal';
    const shuffleImages = req.body.shuffle ?? true;
    const backgroundColor = req.body.backgroundColor ?? '#000';

    await createPoster(req, res, width, height, count, orientation, shuffleImages, backgroundColor);
})

app.listen(
    PORT,
    () => console.log(`Listening on port ${PORT}`),
);
