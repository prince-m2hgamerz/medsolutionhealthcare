import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512]
const appleSizes = [152, 167, 180]
const iconDir = resolve(__dirname, '..', 'public', 'icons')
const svgPath = resolve(__dirname, '..', 'public', 'icon.svg')

if (!existsSync(iconDir)) {
  mkdirSync(iconDir, { recursive: true })
}

const svgBuffer = readFileSync(svgPath)

async function generatePng(size, outputPath) {
  await sharp(svgBuffer).resize(size, size).png().toFile(outputPath)
  console.log(`  Generated ${outputPath} (${size}x${size})`)
}

async function main() {
  console.log('Generating PWA icons...\n')

  for (const size of sizes) {
    await generatePng(size, resolve(iconDir, `icon-${size}x${size}.png`))
  }

  for (const size of appleSizes) {
    await generatePng(
      size,
      resolve(iconDir, `apple-icon-${size}x${size}.png`)
    )
  }

  await generatePng(192, resolve(iconDir, 'icon-192x192.png'))
  await generatePng(512, resolve(iconDir, 'icon-512x512.png'))

  const faviconSizes = [16, 32, 48]
  for (const size of faviconSizes) {
    await generatePng(size, resolve(iconDir, `favicon-${size}x${size}.png`))
  }

  console.log('\nAll icons generated successfully!')
}

main().catch((err) => {
  console.error('Icon generation failed:', err)
  process.exit(1)
})
