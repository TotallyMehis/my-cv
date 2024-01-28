import EleventyPluginVite from '@11ty/eleventy-plugin-vite'
import path from 'path'
import htmlPurge from 'vite-plugin-html-purgecss'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

/**
 * 
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig 
 */
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginVite, {
    viteOptions: {
      build: {
        cssMinify: 'lightningcss',
        assetsInlineLimit: 0
      },
      resolve: {
        alias: {
          '~bootstrap': path.resolve(path.dirname(''), 'node_modules/bootstrap')
        }
      },
      plugins: [
        htmlPurge.default([ /*'highlight-ref',*/ 'sticky', 'position-absolute'/*, /skill-ref/i*/]),
        ViteMinifyPlugin()
      ]
    }
  })

  eleventyConfig.addPassthroughCopy('public/my-face.jpg')
  eleventyConfig.addPassthroughCopy('public/CNAME')
  eleventyConfig.addPassthroughCopy('public/.nojekyll')
  eleventyConfig.addPassthroughCopy('public/sitemap.xml')
  eleventyConfig.addPassthroughCopy('public/robots.txt')
}
