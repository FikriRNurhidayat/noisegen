const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const perlin = require("perlin-noise");
const { createCanvas } = require("canvas");
const { legacyCreatePDF, createImage, createPDF } = require("./lib/canvas");

const app = express();
const staticDir = path.join(__dirname, "../client/dist");

const {
  PORT = 5178,
  NOISE_WIDTH = 512,
  NOISE_HEIGHT = 512,
  CELL_SIZE = 4,
  PDF_PAGE_COUNT = 4,
  PDF_NOISE_WIDTH = 320,
  PDF_NOISE_HEIGHT = 180,
  PDF_CELL_SIZE = 4,
} = process.env;

app.use(cors());
app.use(morgan("dev"));
app.use(express.static(staticDir));

app.get("/", async (req, res) => {
  res.status(200).end();
});

app.post("/noises:random.pdf", async (req, res) => {
  const canvas = createPDF();

  res.setHeader("content-type", "application/pdf");
  res.status(200).send(canvas.toBuffer("application/pdf"));
});

app.get("/noises:random.pdf", async (req, res) => {
  const canvas = legacyCreatePDF({
    noiseHeight: Number(req.query.height),
    noiseWidth: Number(req.query.width),
    cellSize: Number(req.query.cell_size),
    pageCount: Number(req.query.page_count),
  });

  res.setHeader("content-type", "application/pdf");
  res.status(200).send(canvas.toBuffer("application/pdf"));
});

app.get("/noises:random", async (req, res) => {
  const canvas = createImage({
    noiseHeight: Number(req.query.height),
    noiseWidth: Number(req.query.width),
    cellSize: Number(req.query.cell_size),
  });

  res.setHeader("content-type", "image/png");
  res.status(200).send(canvas.toBuffer("image/png"));
});

app.use((req, res, next) => {
  res.redirect("/");
});

app.listen(PORT, "0.0.0.0", () => console.log(`Listening on port ${PORT}!`));
