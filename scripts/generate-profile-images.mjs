#!/usr/bin/env node
/**
 * Generates WebP variant of the profile photo for responsive/optimized delivery.
 * Run: npm run generate-images
 *
 * Output: cedric-photo-400.webp (use with <picture> for WebP support)
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
    .webp({ quality: 82 })
    .toFile(join(publicDir, 'cedric-photo-400.webp'))

  console.log('Generated: cedric-photo-400.webp')
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
