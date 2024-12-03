import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import { minify } from 'html-minifier'
import { PurgeCSS } from 'purgecss'
import { promises as fs } from 'fs'

/**
 * 
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig 
 */
export default function (eleventyConfig) {
  const isDevelopment = false // process.env.ELEVENTY_RUN_MODE !== 'build'

  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy({ 'misc/.nojekyll': '.nojekyll' })
  eleventyConfig.addPassthroughCopy({ 'misc/CNAME': 'CNAME' })
  eleventyConfig.addPassthroughCopy({ 'misc/robots.txt': 'robots.txt' })
  eleventyConfig.addPassthroughCopy({ 'misc/sitemap.xml': 'sitemap.xml' })

  eleventyConfig.addWatchTarget('./css/')
  eleventyConfig.addWatchTarget('./js/')

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath.endsWith('.html')) {
      return minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true
      })
    }

    return content
  })

  eleventyConfig.on('afterBuild', async () => {
    await esbuild.build({
      entryPoints: ['css/site.scss', 'js/nonblocking.js'],
      outdir: '_site/assets',
      minify: !isDevelopment,
      sourcemap: isDevelopment,
      plugins: [sassPlugin()]
    })

    if (!isDevelopment) {
      console.log('Purging CSS...')

      const purgeResult = await new PurgeCSS().purge({
        content: ['_site/**/*.html'],
        css: ['_site/**/*.css'],
        safelist: ['sticky', 'position-absolute'],
        variables: true
      })
      await Promise.all(purgeResult.map(res => {
        console.log('Overwriting purged file', res.file)
        fs.writeFile(res.file, res.css)
      }))
    }
  })
}
