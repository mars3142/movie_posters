import express from "express";
import {createPoster} from "./common.js";

const router = express.Router();

router.get("/", async (req, res) => {
    await createPoster(req, res, 480, 320, 4, "horizontal", true, "#000");
})

export const cinema = {
    router: router,
}
