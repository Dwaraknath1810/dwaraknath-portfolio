import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
async function walk(directory) {
  const files = []
  for (const name of await readdir(directory)) {
    const file = `${directory}/${name}`
    if ((await stat(file)).isDirectory()) files.push(...await walk(file))
    else { const data = await readFile(file); files.push({ file, bytes: data.length, gzip: gzipSync(data).length }) }
  }
  return files
}
const files = (await walk('dist')).sort((a,b) => b.bytes-a.bytes)
console.table(files)
await mkdir('.qa', { recursive: true })
await writeFile('.qa/sizes.json', JSON.stringify(files, null, 2))
const js = files.filter(f => f.file.endsWith('.js'))
if (js.reduce((total, f) => total + f.gzip, 0) > 400000) throw new Error('Total JavaScript exceeds the 400 kB gzip budget')
