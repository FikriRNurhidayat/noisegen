const { faker } = require("@faker-js/faker");
const perlin = require("perlin-noise");
const { createCanvas, Image } = require("canvas");
const { getRandomIntInclusive, getRandomItem } = require("./random");
const { capitalize } = require("./string");

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

const TYPES = [
  "IMAGE_RIGHT",
  "IMAGE_LEFT",
];

const CELL_SIZES = [
  CELL_SIZE / CELL_SIZE,
  CELL_SIZE / 2,
  CELL_SIZE,
  CELL_SIZE * 2,
  CELL_SIZE * CELL_SIZE,
  CELL_SIZE * CELL_SIZE * 2,
  CELL_SIZE * CELL_SIZE * CELL_SIZE,
]

function createImage({
  noiseHeight = NOISE_HEIGHT,
  noiseWidth = NOISE_WIDTH,
  cellSize = CELL_SIZE,
}) {
  noiseHeight ||= NOISE_HEIGHT;
  noiseWidth ||= NOISE_WIDTH;
  cellSize ||= CELL_SIZE;

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

  return canvas;
}

function legacyCreatePDF({
  noiseHeight = PDF_NOISE_HEIGHT,
  noiseWidth = PDF_NOISE_WIDTH,
  cellSize = PDF_CELL_SIZE,
  pageCount = PDF_PAGE_COUNT,
}) {
  noiseHeight ||= PDF_NOISE_HEIGHT;
  noiseWidth ||= PDF_NOISE_WIDTH;
  cellSize ||= PDF_CELL_SIZE;
  pageCount ||= PDF_PAGE_COUNT;

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

  return canvas;
}

function fragmentText(ctx, text, maxWidth) {
  let lines = [];
  let line = text;
  let wrappedWords = [];

  while (ctx.measureText(line).width > maxWidth) {
    let words = line.split(' '); 
    wrappedWords.push(words.pop());
    line = words.join(' ');

    if (ctx.measureText(line).width <= maxWidth) {
      lines.push(line);
      line = wrappedWords.join(' ');
      wrappedWords = [];
    };
  }

  return lines;
}

function createPDF(pages) {
  pages ||= new Array(getRandomIntInclusive(3, 12)).fill().map(() => ({
    title: capitalize(faker.lorem.words(getRandomIntInclusive(2, 3))),
    paragraph: faker.lorem.paragraph(getRandomIntInclusive(8, 10)),
    type: getRandomItem(TYPES),
  }));

  const pageWidth = 1920;
  const pageHeight = 1080;
  const canvas = createCanvas(pageWidth, pageHeight, "pdf");
  const ctx = canvas.getContext("2d");

  pages.forEach((page, index) => {
    const titleSize = 48;
    const paragraphSize = 24;
    const maxWidth = 768;

    let offsetX = 192;
    let offsetY = 384;
    let textOffsetX;
    let textOffsetY;
    let imageOffsetX;
    let imageOffsetY = 284;

    // Generate Image
    const imageCanvas = createImage({ cellSize: getRandomItem(CELL_SIZES) });
    const image = new Image();

    switch(page.type) {
      case "IMAGE_RIGHT":
        textOffsetX = offsetX;
        textOffsetY = offsetY; 
        imageOffsetX = (pageWidth / 2) + offsetX;
        break;
      case "IMAGE_LEFT":
        textOffsetX = pageWidth - offsetX - maxWidth;
        textOffsetY = offsetY; 
        imageOffsetX = offsetX;
        break;
    }

    // Draw Title
    ctx.font = `bold ${titleSize}px VT323`;
    ctx.fillText(page.title, textOffsetX, textOffsetY, maxWidth);

    // Draw Paragraph
    ctx.font = `normal ${paragraphSize}px VT323`;;
    const paragraphs = fragmentText(ctx, page.paragraph, maxWidth)
    paragraphs.forEach((text, index) => {
      ctx.fillText(text, textOffsetX, textOffsetY + titleSize + (paragraphSize * (index + 1)), maxWidth);
    });

    // Draw Image
    image.src = imageCanvas.toDataURL();
    ctx.drawImage(image, imageOffsetX, imageOffsetY);

    if (index != pages.length - 1) ctx.addPage();
  });

  return canvas;
}

module.exports = {
  createImage,
  createPDF,
  legacyCreatePDF,
};
