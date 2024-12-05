import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import markdownit from 'markdown-it'
import deepmerge from 'deepmerge';

const md = markdownit({
  html: false,
  breaks: true,
  linkify: true
});

/**
 * @param {string} str 
 * @returns {string}
 */
function renderMarkdown(str) {
  return md.renderInline(str);
}

/**
 * @param {string} file 
 * @param {boolean} quiet 
 * @returns {string | undefined}
 */
function readFromFile(file, quiet = false) {
  let data = undefined;

  try {
    // HACK: for now
    data = fs.readFileSync(path.resolve(path.dirname(''), 'data/' + file), 'utf8');
  } catch (e) {
    if (!quiet) {
      console.log(e);
    }
  }

  return data;
}

/**
 * @param {string} file 
 * @param {boolean} quiet 
 * @returns {string | undefined}
 */
function readYaml(file, quiet = false) {
  const res = readFromFile(file, quiet);
  return res ? YAML.parse(res) : undefined;
}

/**
 * @param {string} file 
 * @param {boolean} quiet 
 * @returns {string | undefined}
 */
function readMarkdown(file, quiet = false) {
  const res = readFromFile(file, quiet);
  return res ? renderMarkdown(res) : undefined;
}


/**
 * 
 * @param {string} lang 
 * @returns {any} Site data specific to a language (prefix)
 */
export function readData(lang = '') {
  // TODO: Just adding / at the end of the string is not a good idea...
  let prefix = lang;
  if (prefix !== '') {
    prefix = prefix + '/';
  }

  const mergeFunc = (
    /**
     * Merge two objects together.
     * @param {function(string, boolean):string | undefined} func 
     * @param {string} file 
     * @returns {any}
     */
    (func, file) => {
      // Same path, no reason to merge.
      const file2 = prefix + file;
      if (file2 === file) {
        return func(file);
      }


      let res = func(file);
      let res2 = func(file2, true);
      if (!res2) {
        return res;
      } else if (!res) {
        return res2;
      }

      const merged = deepmerge(res, res2, { arrayMerge: (_, source) => source });
      return merged;
    });

  const readSingle = (
    /**
     * Just read one or the other.
     * @param {function(string, boolean):string | undefined} func 
     * @param {string} file 
     * @returns {any}
     */
    (func, file) => {
      let res = func(prefix + file, true);

      if (!res) {
        res = func(file);
      }

      return res;
    });


  const data = {
    projects: mergeFunc(readYaml, 'projects.yml'),
    skillLists: mergeFunc(readYaml, 'skills.yml'),
    aboutMe: readSingle(readMarkdown, 'about_me.md'),
    sections: mergeFunc(readYaml, 'sections.yml'),
    wne: mergeFunc(readYaml, 'work_n_education.yml'),
    appUrl: 'https://cv.mehis.dev'
  };

  // Translate markdown to html
  for (let key in data.sections.aboutMe.education) {
    let edu = data.sections.aboutMe.education[key];

    edu.name = renderMarkdown(edu.name);
    edu.degree = renderMarkdown(edu.degree);
  }

  data.sections.skills.content = data.sections.skills.content.map(content => renderMarkdown(content))

  data.translations = {
    currentId: lang,
    langs: [
      {
        id: '',
        shortname: 'en',
        name: 'english',
        link: '/',
        description: 'Change language to English.'
      },
      {
        id: 'fi',
        shortname: 'fi',
        name: 'finnish',
        link: '/fi/',
        description: 'Vaihda suomen kieleksi.'
      }
    ]
  };

  return data;
}
