const yaml = require('js-yaml');
const fs = require('fs');
const md = require('markdown-it')({
    html: false,
    breaks: true,
    linkify: true
});
const path = require('path');
const deepmerge = require('deepmerge');


function toMd(str) {
    return md.renderInline(str);
}

function relPath(file) {
    // HACK: for now
    return path.resolve(__dirname, 'data/' + file);
}

function readFromFile(file, quiet = false) {
    let data = null;

    try {
        data = fs.readFileSync(relPath(file), 'utf8');
    } catch (e) {
        if (!quiet) {
            console.log(e);
        }
    }

    return data;
}

function readYaml(file, quiet = false) {
    const res = readFromFile(file, quiet);
    return res ? yaml.load(res) : null;
}

function readMarkdown(file, quiet = false) {
    const res = readFromFile(file, quiet);
    return res ? toMd(res) : null;
}


module.exports = {
    // Returns site data specific to a language (prefix)
    readData: (function(lang = '') {
        const data = {};
        

        // TODO: Just adding / at the end of the string is not a good idea...
        let prefix = lang;
        if (prefix !== '') {
            prefix = prefix + '/';
        }


        // Arrays are overridden
        const arrayMergeFn = (target, source, options) => source

        // Merge two objects together.
        const mergeFunc = ((func, file) => {
            // Same path, no reason to merge.
            const file2 = prefix + file;
            if (file2 === file) {
                return func(file);
            }

            
            let res = func(file);
            let res2 = func(file2, true);
            if (!res2) {
                return res;
            }

            const merged = deepmerge(res, res2, { arrayMerge: arrayMergeFn });

            //console.log(merged);

            return merged;
            //return Object.assign(res, res2);
        });

        // Just read one or the other.
        const readSingle = ((func, file) => {
            let res = func(prefix + file, true);

            if (!res) {
                res = func(file);
            }
            
            return res;
        });


        data.projects = mergeFunc(readYaml, 'projects.yml');
        data.skillLists = mergeFunc(readYaml, 'skills.yml');
        data.aboutMe = readSingle(readMarkdown, 'about_me.md');
        data.sections = mergeFunc(readYaml, 'sections.yml');
        data.wne = mergeFunc(readYaml, 'work_n_education.yml');
        data.appUrl = 'https://cv.mehis.dev'


        // Translate markdown to html
        for (let key in data.sections.aboutMe.education) {
            let edu = data.sections.aboutMe.education[key];

            edu.name = toMd(edu.name);
            edu.degree = toMd(edu.degree);
        }
        
        data.sections.skills.content = data.sections.skills.content.map(content => toMd(content))

        data.translations = {
            currentId: lang,
            langs: [
                {
                    id: '',
                    shortname: 'en',
                    name: 'english',
                    link: 'index.html',
                    description: 'Change language to English.'
                },
                {
                    id: 'fi',
                    shortname: 'fi',
                    name: 'finnish',
                    link: 'fi.html',
                    description: 'Vaihda suomen kieleksi.'
                }
            ]
        };

        return data;
    })
};
