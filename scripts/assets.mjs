import sharp from 'sharp'
import { mkdir, readFile, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const original = 'dwaraknath-portrait.png'
await mkdir('public/images', { recursive: true })
for (const width of [480, 800, 1122]) {
  await sharp(original).resize({ width }).webp({ quality: 80, effort: 6 }).toFile(`public/images/portrait-${width}.webp`)
  await sharp(original).resize({ width }).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/images/portrait-${width}.jpg`)
}
// Remove only the verified byte-identical source copy. The root original is untouched.
const hash = data => createHash('sha256').update(data).digest('hex')
const duplicate = 'src/assets/dwaraknath-portrait.png'
try { if (hash(await readFile(original)) === hash(await readFile(duplicate))) await unlink(duplicate) } catch (error) { if (error.code !== 'ENOENT') throw error }
const icon = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" rx="32" fill="#101112"/><text x="25" y="122" font-family="Arial,sans-serif" font-size="94" letter-spacing="-8" fill="#eeefec">db</text><rect x="140" y="111" width="12" height="12" fill="#abc2d4"/></svg>')
await sharp(icon).png().toFile('public/apple-touch-icon.png')
await sharp(icon).resize(32).png().toFile('public/favicon-32.png')
console.log('Responsive portraits and icons generated. Original PNG retained unchanged.')
