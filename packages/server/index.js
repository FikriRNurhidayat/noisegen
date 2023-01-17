const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const perlin = require("perlin-noise");
const { createCanvas } = require("canvas");

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

// TODO: It will always render A4
app.get("/noises:random.pdf", async (req, res) => {
  const pageCount = Number(req.query["page_count"]) || PDF_PAGE_COUNT;
  const noiseHeight = Number(req.query.height) || PDF_NOISE_HEIGHT;
  const noiseWidth = Number(req.query.width) || PDF_NOISE_WIDTH;
  const cellSize = Number(req.query["cell_size"]) || PDF_CELL_SIZE;
  const cellWidth = Math.round(noiseWidth / cellSize);
  const cellHeight = Math.round(noiseHeight / cellSize);
  const canvas = createCanvas(noiseWidth, noiseHeight, "pdf");
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < pageCount; i++) {
    const noises = perlin.generatePerlinNoise(cellWidth, cellHeight);

    for (let y = 0; y < cellHeight; y++) {
      for (let x = 0; x < cellWidth; x++) {
        const noise = noises[(x + 1) * (y + 1) - 1];
        const color = Math.round(255 * noise);
        const rgb = [color, color, color];
        ctx.fillStyle = `rgb(${rgb.join(",")})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    if (i !== pageCount - 1) ctx.addPage();
  }

  res.setHeader("content-type", "application/pdf");
  res.status(200).send(canvas.toBuffer("application/pdf"));
});

app.get("/noises:random", async (req, res) => {
  const noiseHeight = Number(req.query.height) || NOISE_HEIGHT;
  const noiseWidth = Number(req.query.width) || NOISE_WIDTH;
  const cellSize = Number(req.query["cell_size"]) || CELL_SIZE;
  const cellWidth = Math.round(noiseWidth / cellSize);
  const cellHeight = Math.round(noiseHeight / cellSize);
  const noises = perlin.generatePerlinNoise(cellWidth, cellHeight);
  const canvas = createCanvas(noiseWidth, noiseHeight);
  const ctx = canvas.getContext("2d");

  for (let y = 0; y < cellHeight; y++) {
    for (let x = 0; x < cellWidth; x++) {
      const noise = noises[(x + 1) * (y + 1) - 1];
      const color = Math.round(255 * noise);
      const rgb = [color, color, color];
      ctx.fillStyle = `rgb(${rgb.join(",")})`;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  res.setHeader("content-type", "image/png");
  res.status(200).send(canvas.toBuffer("image/png"));
});

app.use((req, res, next) => {
  res.redirect("/");
});

app.listen(PORT, "0.0.0.0", () => console.log(`Listening on port ${PORT}!`));
