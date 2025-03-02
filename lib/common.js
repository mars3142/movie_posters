import axios from "axios";
import shuffle from "shuffle-array";
import {createCanvas, loadImage} from "canvas";

export async function createPoster(req, res, width, height, count, orientation, shuffleImages, backgroundColor, format, language) {
    const apiKey = process.env.TMDB_API_KEY || req.header("x-api-key");
    const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?language=${language}`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Movie Posters'
        }
    });
    const images = [];
    const items = response.data.results;
    for (let i = 0; i < items.length; i++) {
        /// check valid images sizes from https://api.themoviedb.org/3/configuration
        images.push(`https://image.tmdb.org/t/p/original${items[i].poster_path}`);
    }
    if (shuffleImages) {
        shuffle(images);
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    switch (orientation) {
        case 'horizontal':
            const imageWidth = canvas.width / count;
            for (let j = 0; j < count; j++) {
                const image = await loadImage(images[j]);
                const height = image.height * imageWidth / image.width;
                ctx.drawImage(image, imageWidth * j, (canvas.height - height) / 2, imageWidth, height);
            }
            break;

        case 'vertical':
            const imageHeight = canvas.height / count;
            for (let j = 0; j < count; j++) {
                const image = await loadImage(images[j]);
                const width = image.width * imageHeight / image.height;
                ctx.drawImage(image, (canvas.width - width) / 2, imageHeight * j, width, imageHeight);
            }
            break;
    }

    let buffer;
    switch (format) {
        case 'jpeg':
            buffer = canvas.toBuffer('image/jpeg');
            break;

        case 'png':
            buffer = canvas.toBuffer('image/png');
            break;
    }
    res.status(200).type('application/image').end(buffer);
}
