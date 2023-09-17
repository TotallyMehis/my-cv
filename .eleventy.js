const EleventyPluginVite = require('@11ty/eleventy-plugin-vite')
const path = require('path')
const htmlPurge = require('vite-plugin-html-purgecss').default

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyPluginVite, {
        viteOptions: {
            build: {
                cssMinify: 'lightningcss',
                assetsInlineLimit: 0
            },
            resolve: {
                alias: {
                    '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
                }
            },
            plugins: [
                htmlPurge([ /*'highlight-ref',*/ 'sticky', 'position-absolute'/*, /skill-ref/i*/ ])
            ]
        }
    })

    eleventyConfig.addPassthroughCopy('public/my-face.jpg')
    eleventyConfig.addPassthroughCopy('public/CNAME')
    eleventyConfig.addPassthroughCopy('public/.nojekyll')
}
