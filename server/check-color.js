import { Jimp } from 'jimp';

async function checkBackground() {
  const image = await Jimp.read('c:/Users/91700/Desktop/AR/animation/ezgif-frame-001.png');
  // Check top-left pixel
  const color = image.getPixelColor(10, 10);
  const rgba = Jimp.intToRGBA(color);
  console.log(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`);
}

checkBackground().catch(console.error);
