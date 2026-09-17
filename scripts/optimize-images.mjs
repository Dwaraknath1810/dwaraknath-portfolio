import sharp from 'sharp'
import { readFile, unlink } from 'node:fs/promises'

// Resampling and encoding only: no retouching, cutout, or face generation.
const source = 'dwaraknath-portrait.png'
for (const [suffix, width] of [['-small', 480], ['-medium', 768], ['', 1122]]) {
  await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(`src/assets/dwaraknath-portrait${suffix}.webp`)
}
for (const [suffix, width] of [['-small', 576], ['', 1122]]) {
  await sharp(source).resize({ width, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(`src/assets/dwaraknath-portrait${suffix}.jpg`)
}
// Remove only the verified byte-identical copy; the root original is retained.
try {
  const duplicate = 'src/assets/dwaraknath-portrait.png'
  if ((await readFile(source)).equals(await readFile(duplicate))) await unlink(duplicate)
} catch (error) { if (error.code !== 'ENOENT') throw error }
console.log('Portrait WebP and JPEG derivatives generated from the untouched original.')
