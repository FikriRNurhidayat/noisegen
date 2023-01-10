const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const perlin = require("perlin-noise");
const { createCanvas } = require("canvas");
const app = express();
const {
  PORT = 5178,
  NOISE_WIDTH = 512,
  NOISE_HEIGHT = 512,
  CELL_SIZE = 16,
} = process.env;

app.use(cors());
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.status(200).end();
});

app.get("/noises\:random", async (req, res) => {
  const xcell = Math.round(NOISE_WIDTH / CELL_SIZE)
  const ycell = Math.round(NOISE_HEIGHT / CELL_SIZE)
  const noises = perlin.generatePerlinNoise(xcell, ycell);
  const canvas = createCanvas(NOISE_WIDTH, NOISE_HEIGHT);
  const ctx = canvas.getContext('2d')

  for(let y = 0; y < xcell; y++) {
    for(let x = 0; x < ycell; x++) {
      const noise = noises[((x + 1) * (y + 1)) - 1];
      const color = Math.round(255 * noise);
      const rgb = [color, color, color];
      ctx.fillStyle = `rgb(${rgb.join(',')})`;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  res.setHeader('content-type', 'image/png');
  res.status(200).send(canvas.toBuffer('image/png'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
