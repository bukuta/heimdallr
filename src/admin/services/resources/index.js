//import { resource } from '../../index';
import ajax from '$app/services/data-service';
import { rpc } from './rpc.js';
//let crypto = require('crypto');
//console.log(crypto);
//let md5 = crypto.createHash('MD5');
//console.log(md5);

let _request = ajax.request;
ajax.request = function() {
  return _request.call(ajax, ...arguments).then(rs => {
    if (rs instanceof Error) {
      throw rs;
    }
    return rs;
  }, err => {
    throw err;
  });
}

class Base {
  constructor({url:url}) {
    this._url = url;
    this._params = {};
  }
  get params() {
    return Object.assign({}, this._params);
  }
  setParams(k, v) {
    if (typeof (k) != 'undefined' && typeof (v) != 'undefined') {
      this._params[k] = v;
    } else if (typeof (v) == 'undefined' && typeof (k) == 'object') {
      Object.assign(this._params, k);
    }
  }
  get url() {
    let ps = this.params;
    let url = typeof (this._url) == 'function' ? this._url() : this._url;
    return url;
    let qs = Object.entries(ps).map((k, v) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(v)
    }).join('&');
    if (qs) {
      return url + '?' + qs;
    } else {
      return url;
    }
  }
  set url(u) {
    this._url = u;
  }
  fetch(options) {
    options = Object.assign({
      path: this.url,
      query: this.params,
      method: 'GET'
    }, options);
    return ajax.request(options).then(rs=>{
      if(this.parse&&typeof(this.parse)=='function'){
        return this.parse(rs);
      }
      return rs;
    });
  }
  _fetch(options) {
    options = Object.assign({
      path: this.url,
      query: this.params,
      method: 'GET'
    }, options);
    return ajax.request(options);
  }
}

class BaseModel extends Base {
  constructor({url, item}) {
    super({
      url: url
    });
    this._item = item;
  }
  get id() {
    return this._item && this._item[this.idAttribute];
  }
  fetch() {
    return super.fetch(...arguments).then(rs => {
      this._item = rs;
      return rs;
    });
  }
  _getDiff(newObject, oldObject) {
    let diff = {};
    let originItem = this._item || {};
    Object.entries(payload).forEach(([k, v]) => {
      if (originItem[k] != v) {
        diff[k] = v;
      }
    });
    return diff;
  }
  update(payload) {
    delete payload.id;
    delete payload.creator;
    let data = payload;

    return ajax.request({
      path: this.url,
      //query: this.params,
      method: 'patch',
      headers: {
        'Content-Type': 'application/json'
      },
      //payload: JSON.stringify(payload),
      body: JSON.stringify(data),
    }).then(rs => {
      return rs;
    });
  }
  destory() {
    console.warn('model.destory', this.url);
    return ajax.request({
      path: this.url,
      //query: this.params,
      method: 'delete',
    }).then(rs => {
      return rs;
    });
  }
}

class BaseCollection extends Base {
  constructor(options = {}) {
    super({
      url: options.url || 'todo'
    });
    this._items = null;
    this._page = 1;
    this._pagesize = 20;
    this._Model = options && options.model || BaseModel;
    this._idAttribute = options && options.idAttribute || 'id';
  }
  set page(pg) {
    this._page = pg;
  }
  get page() {
    return this._page;
  }
  set pageSize(ps) {
    this._pageseize = ps;
  }
  get pageSize() {
    return this._pagesize;
  }
  get total() {
    return thiks._total;
  }

  get idAttribute() {
    return this._idAttribute || 'id';
  }
  get params() {
    let limit = this.pageSize;
    let offset = Math.max(this.page - 1, 0) * this.pageSize;
    return Object.assign({}, this._params, {
      //page: this.page,
      //pagesize: this.pageSize,
      limit,
      offset,
    });
  }

  fetch() {
    return super.fetch().then(rs => {
      this._items = rs.items;
      this._total = rs.total;
      return rs;
    });
  }
  create(payload) {
    return ajax.request({
      path: this.url,
      query: this.params,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      //payload: JSON.stringify(payload),
      body: JSON.stringify(payload),
    }).then(rs => {
      return rs;
    });
  }
  destory(payload) {
    return ajax.request({
      path: this.url + '/',
      query: this.params,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      //payload: JSON.stringify(payload),
      body: JSON.stringify(payload),
    }).then(rs => {
      return rs;
    });
  }
  select(id) {
    let idAttribute = this.idAttribute;
    let rs = (this._items || []).filter(it => it[idAttribute] == id)
    let target = rs && rs[0];
    let url = `${this.url}/${id}`;
    let model = new this._Model({
      url: url,
      item: target
    });
    return model;
  }
}

class Users extends BaseCollection {
  constructor() {
    super();
    this.url = `/users`;
  }
}

class User extends BaseModel {
  constructor() {
    super({
      url: '/user'
    });
  }

  @rpc('/initdata','GET')
  initdata(payload) {
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  @rpc('/login')
  login(payload) {
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  @rpc('/logout')
  logout() {
    return {};
  }

  @rpc('/password', 'PUT')
  password(payload) {
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  @rpc('/smscaptcha','POST')
  getSMSCaptcha(payload){
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }
}

class Assist extends BaseModel {
  constructor() {
    super({
      url: '/assist'
    });
  }

  @rpc('/verify-email')
  emailVerify(payload) {
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  @rpc('/verify-email-captcha')
  emailCaptchaVerify(payload) {
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  @rpc('/reset-password')
  resetPassword(payload) {
    return {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }
}

class Apis extends BaseModel{
  constructor(){
    super({url: '/specs'});
    let url = new URL(location.href);
    let jsonpath = url.searchParams.get('url');
    if(jsonpath){
      this.url = jsonpath;
    }
  }
  parse(rs){
    this._rawResponse = rs;
    return rs;
  }
  groupByTags(){
    let tags = {};
    if(this._rawResponse){
      this._rawResponse.tags.forEach(tag=>{
        tags[tag.name]=tag;
        tag.items=[];
      });
    }
    if( this._item){
      this._item.items.forEach(item=>{
        item.tags.forEach(tag=>{
          tags[tag]=tags[tag]||{items:[],name:tag};
          tags[tag].items.push(item);
        });
      });
    }
    console.warn('groupByTags',tags);
    return tags;
  }
  getServers(){
    let servers = {};
    if(this._rawResponse){
      this._rawResponse.servers.forEach(item=>{
        servers[item.name]=item;
      });
    }
    return servers;
  }
  getEntities(){
    return Object.entries(this._rawResponse.components.schemas).map(([k,v])=>{
      v.name=k;
      return v;
    });
  }
  getTags(){
    return this._rawResponse.tags;
  }
  fetch(){
    if(this._rawResponse){
      return Promise.resolve(this.parse(this._rawResponse));
    }else{
      return super.fetch({...arguments,noBase:true})
    }
  }
  collectionMock(node,name){
    let r =  collectMocksFromEntity(node,this._rawResponse.apis);
    let key = name;
    switch(r.type){
      case 'array':
        key=`${name}|2-10`;
        break;
      case 'enum':
        key=`${name}|1`;
        break;
    }

    return {[key]:r.mock};
    return r.mock;
  }

  @rpc('skip')
  skip(payload){
    return {
      headers:{'Content-Type': 'application/json',},
      body: JSON.stringify(payload),
    };
  }

  @rpc('restore')
  restore(payload){
    return {
      headers:{'Content-Type': 'application/json',},
      body: JSON.stringify(payload),
    };
  }

  @rpc('/proxy')
  proxyIt(payload){
    return {
      headers:{'Content-Type': 'application/json',},
      body: JSON.stringify(payload),
    };
  }
  @rpc('set-server')
  skip(payload){
    return {
      headers:{'Content-Type': 'application/json',},
      body: JSON.stringify(payload),
    };
  }
  tryRequest(path, method, detail) {
    console.warn('tryRequest', ...arguments);
    let params = detail.parameters || [];
    let pmockmap = {};
    let pmocks = params.map(param => {
      let schema = param.schema;
      if (schema.$ref) {
        let node = pickNode(data, schema.$ref);
        pmockmap[param.name] = node['x-mock'];
        return node['x-mock'];
      } else if (schema['x-mock']) {
        pmockmap[param.name] = schema['x-mock'];
        return schema['x-mock'];
      }
    });
    Object.keys(pmockmap).forEach((name) => {
      let mocktemplate = pmockmap[name];
      let data = Mock.mock(mocktemplate);
      pmockmap[name] = data;
    })
    console.warn(pmockmap);
    let npath = path.replace(/(\{([^}]+)\})/g, function(match, p1, p2, offset, ori) {
      return pmockmap[p2];
    });
    console.log(npath)

    let body = detail.requestBody;
    let bodyMock;
    if (body) {
      let m = collectMocksFromResponse(body, data);
      let mock = Mock.mock(m);
      bodyMock = JSON.stringify(mock);
      console.log(m, mock);
    }

    // 生成请求的host=>url, method,payload, query
    let host = this.currentServer.url
    let url = host + npath;
    console.warn(url);
    var linkE = document.createElement('a');
    linkE.href = url;
    url = linkE.href;
    var parsedUrl = new URL(url);

    let queryObject = parsedUrl.searchParams;
    params.forEach(param => {
      if (param.in == 'query') {
        if (param.schema['x-mock']) {
          queryObject.append(param.name, pmockmap[param.name]);
        } else if (param.default) {
          queryObject.append(param.name, param.default);
        }
      }
    });
    console.warn('queryObject', queryObject.toString());

    fetch(parsedUrl.toString(), {
      method: method.toUpperCase(),
      credentials: 'include',
      body: bodyMock,
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': body && Object.keys(body.content)[0],
      },
    }).then(res => res.json()).then(res => console.log(res));
  }
  skipIt( /*path,method,statuscode,$event*/ ) {
    let args = [].slice.call(arguments, 0);
    let $event = args.pop();
    let [path, method, statuscode] = args;
    let checked = $event.target.checked;

    console.warn(path, method, statuscode, checked);
    fetch('/:console/skip', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path,
        method,
        statuscode,
        checked
      })
    }).then(res => res.json()).then(res => console.log(res));
  }
  isSelected(path,method,url){
    let r ;
    if(method){
      r =  decorations[path] &&
        decorations[path].methods &&
        decorations[path].methods[method] &&
        decorations[path].methods[method].proxyEnable&&
        decorations[path].methods[method].proxy==url;
    }
    if(!r&&path){
      r = decorations[path] &&
        decorations[path].proxyEnable&&
        decorations[path].proxy==url;
    }
    console.warn('isSelected',path,method,url,r);
    return r;
  }
  isSkip(decorations,path, method, statuscode) {
    if (statuscode) {
      return decorations[path] &&
        decorations[path].methods &&
        decorations[path].methods[method] &&
        decorations[path].methods[method].responses &&
        decorations[path].methods[method].responses[statuscode] &&
        decorations[path].methods[method].responses[statuscode].skip;
    }
    if (method) {
      return decorations[path] &&
        decorations[path].methods &&
        decorations[path].methods[method] &&
        decorations[path].methods[method].skip;
    }
    if (path) {
      return decorations[path] &&
        decorations[path].skip;
    }
  }
  skipAllException() {
    let payload = [];
    for (let [path, route] of Object.entries(data.paths || {})) {
      for (let [method, methoddetail] of Object.entries(route || {})) {
        for (let [statuscode, response] of Object.entries(methoddetail.responses || {})) {
          let r = parseInt(statuscode / 100, 10);
          console.log(path, method, statuscode, r)
          payload.push({
            path,
            method,
            statuscode,
            checked: r != 2
          });
        }
      }
    }
    console.log(payload);
    fetch('/:console/skip', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => console.log(res));
  }
  resetAll() {
    let payload = [];
    for (let [path, route] of Object.entries(data.paths || {})) {
      for (let [method, methoddetail] of Object.entries(route || {})) {
        for (let [statuscode, response] of Object.entries(methoddetail.responses || {})) {
          let r = parseInt(statuscode / 100, 10);
          payload.push({
            path,
            method,
            statuscode,
            checked: false
          });
        }
      }
    }
    console.log(payload);
    fetch('/:console/skip', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => console.log(res));
  }
  changeServer(event) {
    console.log(event.target.value);
    let servername = event.target.value;
    let currentServer = data.servers.filter(server => server.name == servername)[0];

    console.log(currentServer);
    fetch('/:console/set-server', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentServer)
    }).then(res => res.json()).then(res => console.log(res));
  }
}

export { User, BaseModel,BaseCollection,rpc, Apis};


let tagsmap = {};

function getResponseObject(response,root){
  let content = response && response.content && response.content['application/json'];
  if (content) {
    content = content.schema;
    if (content.hasOwnProperty('$ref')) {
      content = pickNode(root, content['$ref']);
    }
    m = collectMocksFromEntity(content, root).mock;
  }
  return content;
}
function collectMocksFromResponse(response, root) {
  let content = getResponseObject(response,root);
  let m;
  if (content) {
    m = collectMocksFromEntity(content, root).mock;
  }
  return m;
}

function collectMocksFromEntity(schema, root) {
  let properties = schema.properties;
  let r = {};
  let type = '';
  if (properties) {
    // object
    for (let name in properties) {
      let value = properties[name];
      if (value.hasOwnProperty('x-mock')) {
        r[name] = value['x-mock'];
      } else if (value.hasOwnProperty('$ref')) {
        let node = pickNode(root, value['$ref']);
        let m = collectMocksFromEntity(node, root);
        if (m.type == 'enum') {
          r[name + '|1'] = m.mock;
        } else {
          r[name] = m.mock;
        }
      } else if (value.type == 'object') {
        let m = collectMocksFromEntity(value, root);
        if (m.type == 'enum') {
          r[name + '|1'] = m;
        } else if (m.type == 'array') {
          r[name + '|1-10'] = m;
        }
      } else if (value.type == 'array') {
        let items = value.items;
        if (items.oneOf) {
          items = items.oneOf;
        } else if (items.allOf) {
          items = items.allOf;
        } else if (items.anyOf) {
          items = items.anyOf;
        } else {
          items = [value.items];
        }
        let m = items.map(item => collectMocksFromEntity({
          properties: {
            items: item
          }
        }, root).mock.items);
        type = 'array';
        r[name + '|1-10'] = m;
      }
    }
  } else {
    // refs/enum
    if (schema.hasOwnProperty('x-mock')) {
      r = schema['x-mock'];
    } else if (schema.hasOwnProperty('enum')) {
      r = schema['enum'];
      type = 'enum';
    }
  }
  return {
    type,
    mock: r
  };
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

let methods= {
  tryRequest(path, method, detail) {
    console.warn('tryRequest', ...arguments);
    //let regPath = path.replace(/(\{([^}]+)\})/g, ':$2');
    //let keys = [];
    //regPath = pathToRegexp(regPath, keys);

    let params = detail.parameters || [];
    //console.warn(regPath,params);
    let pmockmap = {};
    let pmocks = params.map(param => {
      let schema = param.schema;
      if (schema.$ref) {
        let node = pickNode(data, schema.$ref);
        pmockmap[param.name] = node['x-mock'];
        return node['x-mock'];
      } else if (schema['x-mock']) {
        pmockmap[param.name] = schema['x-mock'];
        return schema['x-mock'];
      }
    });
    Object.keys(pmockmap).forEach((name) => {
      let mocktemplate = pmockmap[name];
      let data = Mock.mock(mocktemplate);
      pmockmap[name] = data;
    })
    console.warn(pmockmap);
    let npath = path.replace(/(\{([^}]+)\})/g, function(match, p1, p2, offset, ori) {
      return pmockmap[p2];
    });
    console.log(npath)

    let body = detail.requestBody;
    let bodyMock;
    if (body) {
      let m = collectMocksFromResponse(body, data);
      let mock = Mock.mock(m);
      bodyMock = JSON.stringify(mock);
      console.log(m, mock);
    }

    // 生成请求的host=>url, method,payload, query
    let host = this.currentServer.url
    let url = host + npath;
    console.warn(url);
    var linkE = document.createElement('a');
    linkE.href = url;
    url = linkE.href;
    var parsedUrl = new URL(url);

    let queryObject = parsedUrl.searchParams;
    params.forEach(param => {
      if (param.in == 'query') {
        if (param.schema['x-mock']) {
          queryObject.append(param.name, pmockmap[param.name]);
        } else if (param.default) {
          queryObject.append(param.name, param.default);
        }
      }
    });
    console.warn('queryObject', queryObject.toString());

    fetch(parsedUrl.toString(), {
      method: method.toUpperCase(),
      credentials: 'include',
      body: bodyMock,
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': body && Object.keys(body.content)[0],
      },
    }).then(res => res.json()).then(res => console.log(res));

  },
  skipIt( /*path,method,statuscode,$event*/ ) {
    let args = [].slice.call(arguments, 0);
    let $event = args.pop();
    let [path, method, statuscode] = args;
    let checked = $event.target.checked;

    console.warn(path, method, statuscode, checked);
    fetch('/:console/skip', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path,
        method,
        statuscode,
        checked
      })
    }).then(res => res.json()).then(res => console.log(res));
  },
  proxyIt( /*path,method,statuscode,$event*/ ) {
    let args = [].slice.call(arguments, 0);
    let $event = args.pop();
    let [path, method, statuscode] = args;
    let proxy = $event.target.value;
    let checked = !!proxy;

    console.warn(path, method, statuscode, checked);
    fetch('/:console/proxy', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path,
        method,
        statuscode,
        checked,
        proxy,
      })
    }).then(res => res.json()).then(res => console.log(res));
  },
  isSelected(path,method,url){
    let r ;
    if(method){
      r =  decorations[path] &&
        decorations[path].methods &&
        decorations[path].methods[method] &&
        decorations[path].methods[method].proxyEnable&&
        decorations[path].methods[method].proxy==url;
    }
    if(!r&&path){
      r = decorations[path] &&
        decorations[path].proxyEnable&&
        decorations[path].proxy==url;
    }
    console.warn('isSelected',path,method,url,r);
    return r;
  },
  isSkip(decorations,path, method, statuscode) {
    console.log(...arguments);
    if (statuscode) {
      return decorations[path] &&
        decorations[path].methods &&
        decorations[path].methods[method] &&
        decorations[path].methods[method].responses &&
        decorations[path].methods[method].responses[statuscode] &&
        decorations[path].methods[method].responses[statuscode].skip;
    }
    if (method) {
      return decorations[path] &&
        decorations[path].methods &&
        decorations[path].methods[method] &&
        decorations[path].methods[method].skip;
    }
    if (path) {
      return decorations[path] &&
        decorations[path].skip;
    }
  },
  skipAllException() {
    let payload = [];
    for (let [path, route] of Object.entries(data.paths || {})) {
      for (let [method, methoddetail] of Object.entries(route || {})) {
        for (let [statuscode, response] of Object.entries(methoddetail.responses || {})) {
          let r = parseInt(statuscode / 100, 10);
          console.log(path, method, statuscode, r)
          payload.push({
            path,
            method,
            statuscode,
            checked: r != 2
          });
        }
      }
    }
    console.log(payload);
    fetch('/:console/skip', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => console.log(res));
  },
  resetAll() {
    let payload = [];
    for (let [path, route] of Object.entries(data.paths || {})) {
      for (let [method, methoddetail] of Object.entries(route || {})) {
        for (let [statuscode, response] of Object.entries(methoddetail.responses || {})) {
          let r = parseInt(statuscode / 100, 10);
          payload.push({
            path,
            method,
            statuscode,
            checked: false
          });
        }
      }
    }
    console.log(payload);
    fetch('/:console/skip', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => console.log(res));
  },
  changeServer(event) {
    console.log(event.target.value);
    let servername = event.target.value;
    let currentServer = data.servers.filter(server => server.name == servername)[0];

    console.log(currentServer);
    fetch('/:console/set-server', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json,*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentServer)
    }).then(res => res.json()).then(res => console.log(res));

  },
};
