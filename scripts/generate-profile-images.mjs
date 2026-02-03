#!/usr/bin/env node
/**
 * Generates 200px and WebP variants of the profile photo for responsive image delivery.
 * Run once after npm install: npm run generate-images
 */
import sharp from 'sharp'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const srcPath = join(publicDir, 'cedric-photo-400.png')

if (!existsSync(srcPath)) {
  console.error('Source image not found: public/cedric-photo-400.png')
  process.exit(1)
}

async function generate() {
  await sharp(srcPath)
    .resize(200, 200)
    .png({ compressionLevel: 6 })
    .toFile(join(publicDir, 'cedric-photo-200.png'))

  await sharp(srcPath)
    .resize(200, 200)
    .webp({ quality: 82 })
    .toFile(join(publicDir, 'cedric-photo-200.webp'))

  await sharp(srcPath)
    .webp({ quality: 82 })
    .toFile(join(publicDir, 'cedric-photo-400.webp'))

  console.log('Generated: cedric-photo-200.png, cedric-photo-200.webp, cedric-photo-400.webp')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
