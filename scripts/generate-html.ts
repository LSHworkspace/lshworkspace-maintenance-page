import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function generate() {
  try {
    const server = await createServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })

    const appModule = await server.ssrLoadModule(path.resolve(__dirname, '../src/App.tsx'))
    const { default: App } = appModule

    // Server-side rendering needs React to be imported for createElement to work implicitly or explicitly used
    // We import 'react' dynamically or assume usage within the loaded module if it builds the element
    // However, since we are using renderToString, we need to pass a React Element.
    // Let's import React and renderToString here.
    const { renderToString } = await import('react-dom/server')
    const { createElement } = await import('react')

    const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
    const appHtml = renderToString(createElement(App))

    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )

    fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), html)
    console.log('HTML generated successfully using Vite SSR!')

    await server.close()
  } catch (e) {
    console.error('Error generating HTML:', e)
    process.exit(1)
  }
}

generate()
