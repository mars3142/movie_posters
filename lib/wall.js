import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).type("html")
  .send('');
});

export const wall = {
  router: router,
};