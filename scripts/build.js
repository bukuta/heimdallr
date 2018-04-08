const debug = require('debug')('buildapi');
const debug2 = require('debug')('postFix');
const debug3 = require('debug')('error');
const debug4 = require('debug')('pureXs');
const _ = require('lodash');
const yaml = require('js-yaml');
const util = require('util');
const fs = require('fs');
const path = require('path');

const parseYAML = yaml.safeLoad;
const stringifyYAML = yaml.safeDump;
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const projectRoot = process.cwd();

async function parseYamlFile(file) {
  let content = await readFile(file, 'utf-8');
  let obj = parseYAML(content);
  return obj;
}

async function getAllNodes(indir) {
  let files = await readdir(indir);
  let objects = await Promise.all(files.map(file => {
    let realpath = path.join(indir, file);
    debug(realpath);
    return realpath;
  }).filter(file => path.extname(file) == '.yaml').map(parseYamlFile));
  //debug('objects:', objects.length, objects);
  let all = objects.reduce((last, current) => {
    return {
      ...last,...current
    };
  }, {});
  //debug('all:', all);
  //console.log(contents);
  return all;
}

async function getAllProtos(indir){
  let files = await readdir(indir);
  let filteredFiles = files.map(file => {
    let realpath = path.join(indir, file);
    debug(realpath);
    return realpath;
  }).filter(file => path.extname(file) == '.proto');
  let objects = await Promise.all(filteredFiles.map((file)=>{return readFile(file,'utf-8')}));
  //debug('objects:', objects.length, objects);
  let all = {};
  let srcpath = path.resolve(__dirname,'../src/components/x-protos/');
  filteredFiles.forEach((file,index)=>{
    let relativepath = path.relative(srcpath,file);
    debug('relativepath',relativepath);
    all[relativepath]=objects[index];
  })
  //debug('all:', all);
  //console.log(contents);
  return all;
}

/**
 * 处理 '@#xxx'这样的复用形式，
 */
let omits = {};
async function postFix(main, root, parent, currentpath) {
  Object.keys(main).forEach(key => {
    let subtree = main[key];
    if (isTemplateRef(key)) {
      let params = {}
      Object.keys(subtree).forEach(key => {
        if (isTemplateParams(key)) {
          let name = key.substring(1);
          params[name] = subtree[key]
        }
      });
      Object.keys(params).length && debug2(params);
      let node = pickNode(root, key);
      omits[key.replace(/^@#\//, '')] = 1;
      try {
        let r = JSON.parse(_.template(JSON.stringify(node))(params));
        delete main[key];
        for (let k in r) {
          main[k] = r[k];
        }
      } catch (e) {
        debug3(currentpath, key);
      }
      delete main['@isTemplate'];
    } else if (key == '@isTemplate') {
      for (var k in parent) {
        if (parent[k] == main) {
          omits[currentpath] = 1;
        }
      }
    } else {
      if (subtree && typeof subtree == 'object') {
        postFix(subtree, root, main, currentpath ? currentpath + '/' + key : key);
      }
    }
  });
}
async function pureXs(main, root, parent, currentpath) {
  //debug4('pureXs',main);
  Object.keys(main).forEach(key => {
    let subtree = main[key];
    //debug4('check',key,currentpath);
    if (key == 'x-omit') {
      let ref = main['$ref'];
      let omitField = main[key];
      //debug4('omitField',ref,omitField);
      delete main['$ref'];
      delete main[key];
      let node = JSON.parse(JSON.stringify(pickNode(root, ref)));
      //debug4(ref,node);
      node.properties
      for (var k in node) {
        main[k] = node[k];
        if (k == 'properties') {
          main[k] = {};
          for (var kk in node[k]) {
            if (!omitField[kk]) {
              main[k][kk] = node[k][kk];
            }
          }
        }
      }
    } else {
      if (subtree && typeof subtree == 'object') {
        pureXs(subtree, root, main, currentpath ? currentpath + '/' + key : key);
      }
    }
  });
}
function pickNode(root, keypath) {
  let paths = keypath.replace(/^@#\//, '').replace(/^#\//, '').split('/').filter(k => k);
  let node = paths.reduce((last, path) => {
    if (last && last[path]) {
      return last[path];
    }
    return null;
  }, root);

  return node;
}
function isTemplateRef(key) {
  let r = /^@#.*/.test(key);
  return r;
}
function isTemplateParams(key) {
  let r = /^@.*/.test(key);
  return r;
}
function omitKeys(main) {
  Object.keys(omits).forEach(keypath => {
    let paths = keypath.replace(/^@#/, '').split('/').filter(k => k);
    debug2('omitKeys', keypath, paths);
    paths.reduce((last, path, index, all) => {
      if (index == paths.length - 1) {
        delete last[path];
      } else {
        return last && last[path];
      }
    }, main);
  });
}

async function run() {
  try {
    let main = await parseYamlFile(path.join(projectRoot,'src/main.yaml'));
    let paths = await getAllNodes(path.join(projectRoot,'src/paths'));
    let schemas = await getAllNodes(path.join(projectRoot,'src/components/schemas'));
    let requestBodies = await getAllNodes(path.join(projectRoot,'src/components/requestBodies'));
    let responses = await getAllNodes(path.join(projectRoot,'src/components/responses'));
    let tags = await parseYamlFile(path.join(projectRoot,'src/tags.yaml'));
    let protos = await getAllProtos(path.join(projectRoot,'src/components/x-protos'));
    debug('protos',protos);

    main.tags = tags.tags;
    main.paths = paths;
    main.components = {
      schemas,
      requestBodies,
      responses,
      'x-protos': protos,
    };
    postFix(main, main);
    omitKeys(main);
    await pureXs(main.paths, main);
    await writeFile(path.join(projectRoot,`dist/index.json`), JSON.stringify(main, 0, 2), 'utf-8');

    let content = stringifyYAML(main);
    await writeFile(path.join(projectRoot,`dist/index.yaml`), content, 'utf-8');
  } catch (e) {
    console.log(e);
  }
}
process.on('exit', function(err) {
  console.log(err);
})
run();
