import express from "express";
import axios from 'axios';
import shuffle from 'shuffle-array';
import {createCanvas, loadImage} from "canvas";

const router = express.Router();

router.get("/", (req, res) => {
    const apiKey = process.env.TMDB_API_KEY || req.header("x-api-key");
    axios.get('https://api.themoviedb.org/3/trending/movie/week?language=de-DE', {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Movie Posters'
        }
    }).then(async (response) => {
        const images = [];
        const items = response.data.results;
        for (let i = 0; i < items.length; i++) {
            images.push(`https://image.tmdb.org/t/p/w154${items[i].poster_path}`);
        }
        shuffle(images);

        const canvas = createCanvas(480, 320);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const count = 4;
        const imageWidth = canvas.width / count;
        for (let j = 0; j < count; j++) {
            const url = images[j];
            const image = await loadImage(images[j]);
            const height = image.height * imageWidth / image.width;
            ctx.drawImage(image, imageWidth * j, (canvas.height - height) / 2, imageWidth, height);
        }

        const buffer = canvas.toBuffer("image/png");
        res.status(200).type("image/png").end(buffer);
    }).catch((error) => {
        // Log the error message and code
        console.log(`Error message: ${error.message}`);
        console.log(`Error code: ${error.code}`);

        // Log the response status and data if available
        if (error.response) {
            console.log(`Response status: ${error.response.status}`);
            console.log(`Response data: ${JSON.stringify(error.response.data)}`);
        }

        // Log the request method and path if available
        if (error.request) {
            console.log(`Request method: ${error.request.method}`);
            console.log(`Request path: ${error.request.path}`);
        }
        res.status(error.code).send(error.message);
    });
})

export const cinema = {
    router: router,
}
