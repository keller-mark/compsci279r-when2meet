import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Reference: https://vitejs.dev/config/
export default defineConfig({
  // Use the react plugin to enable JSX syntax and hot reloading.
  plugins: [react()],
  // Set the base url path on which this will be served
  // when deployed to github-pages.
  base: '/compsci279r-when2meet/',
})