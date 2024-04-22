import { defineConfig } from 'vite'
import vitePluginSprite from './index'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vitePluginSprite({ source: '**/sprite', hash: true })
    ],
  }
})