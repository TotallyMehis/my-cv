module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy({ "src/misc/CNAME": "CNAME" });
    eleventyConfig.addPassthroughCopy({ "src/misc/.nojekyll": ".nojekyll" });

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
