import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).type("json")
  .send(`{"status":"${res.status}"}`);
})

export const cinema = {
  router: router,
}