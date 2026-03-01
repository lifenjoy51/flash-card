import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync } from 'fs'
import { createHash } from 'crypto'
import { resolve } from 'path'

function imageHashPlugin() {
  return {
    name: 'image-hash',
    config() {
      const imgDir = resolve(__dirname, 'public/images')
      const hashes: Record<string, string> = {}
      for (const file of readdirSync(imgDir)) {
        const content = readFileSync(resolve(imgDir, file))
        hashes[file] = createHash('md5').update(content).digest('hex').slice(0, 8)
      }
      return {
        define: {
          __IMAGE_HASHES__: JSON.stringify(hashes),
        },
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imageHashPlugin()],
  base: '/flash-card/', // GitHub 저장소 이름이 flash-card일 경우
})
