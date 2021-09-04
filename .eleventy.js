module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/CNAME");
    eleventyConfig.addPassthroughCopy("src/.nojekyll");

    eleventyConfig.setTemplateFormats([
        "pug"
    ]);

    return {
        dir: {
            input: 'src',
            output: '_site',

            includes: 'includes'
        }
    };
};
