import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.resolve(__dirname, '../dist')

function inlineLocalAssets(html: string) {
  const withStyles = html.replace(
    /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
    (_tag, assetPath: string) => {
      const css = fs
        .readFileSync(path.join(distDirectory, assetPath), 'utf-8')
        .replace(/<\/style/gi, '<\\/style')

      return `<style>${css}</style>`
    }
  )

  return withStyles.replace(
    /<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/g,
    (_tag, assetPath: string) => {
      const javascript = fs
        .readFileSync(path.join(distDirectory, assetPath), 'utf-8')
        .replace(/<\/script/gi, '<\\/script')

      return `<script type="module">${javascript}</script>`
    }
  )
}

async function generate() {
  try {
    const server = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      optimizeDeps: { noDiscovery: true },
    })

    const appModule = await server.ssrLoadModule(path.resolve(__dirname, '../src/App.tsx'))
    const { default: App } = appModule

    // Server-side rendering needs React to be imported for createElement to work implicitly or explicitly used
    // We import 'react' dynamically or assume usage within the loaded module if it builds the element
    // However, since we are using renderToString, we need to pass a React Element.
    // Let's import React and renderToString here.
    const { renderToString } = await import('react-dom/server')
    const { createElement } = await import('react')

    const template = fs.readFileSync(path.join(distDirectory, 'index.html'), 'utf-8')
    const appHtml = renderToString(createElement(App))

    const renderedHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )
    const html = inlineLocalAssets(renderedHtml)

    fs.writeFileSync(path.join(distDirectory, 'index.html'), html)
    console.log('Self-contained HTML generated successfully using Vite SSR!')

    await server.close()
  } catch (e) {
    console.error('Error generating HTML:', e)
    process.exit(1)
  }
}

generate()
