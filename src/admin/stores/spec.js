// 接口文档
import { Apis } from '$app/services/resources';
import _ from 'lodash';
let debug = require('debug')('store');
let apis = new Apis();

const specStore = {
  namespaced: true,
  state: {
    spec: null,
    status: '',
  },

  getters: {
    currentServer: state => {
      return state.spec && state.spec.servers[0] || {};
    },
    paths: state => {
      let currentServer = _.get(state,'spec.servers[0]',{});
      debug('currentServer', currentServer );

      let paths = JSON.parse(JSON.stringify(state.spec && state.spec.paths || {}));
      let decorations = {};

      let items = [];

      for (let [path, handles] of Object.entries(paths)) {
        for (let [method, route] of Object.entries(handles)) {
          route.responses = Object.keys(route.responses).map(code => {
            let isSkip = apis.isSkip(decorations, path, method, code);
            return Object.assign(route.responses[code], {
              code,
              isSkip
            });
          });
          let isSkip = apis.isSkip(decorations, path, method);
          let server = currentServer.url;
          let proxyEnable = false;
          let tmp = decorations[path];
          if (tmp) {
            if (tmp.proxy) {
              server = tmp.proxy;
              proxyEnable = tmp.proxyEnable;
            } else if (tmp = tmp.methods[method]) {
              if (tmp.proxy) {
                server = tmp.proxy;
                proxyEnable = tmp.proxyEnable;
              }
            }
          }

          items.push(Object.assign(route, {
            path,
            method,
            'x-skip': isSkip,
            'x-server': server,
            'x-proxyEnable': proxyEnable,
          }));
        }
      }

      return {
        items,
        total: items.length
      };

    //return state.spec&&state.spec.paths||[];
    //return _.get(state.spec, 'paths', []);
    },
    tags: state => {
      let r = {};
      state.spec && state.spec.tags.forEach(tag => {
        r[tag.name] = tag;
        tag.items = [];
      })
      return r;
      //return state.spec&&state.spec.tags||[];
      //return _.get(state.spec, 'tags', []);

      let tags = {};
      if (this._rawResponse) {
        this._rawResponse.tags.forEach(tag => {
          tags[tag.name] = tag;
          tag.items = [];
        });
      }
      if (this._item) {
        this._item.items.forEach(item => {
          item.tags.forEach(tag => {
            tags[tag] = tags[tag] || {
              items: [],
              name: tag
            };
            tags[tag].items.push(item);
          });
        });
      }
      return tags;
    },
    servers: state => {
      return state.spec && state.spec.servers || [];
      return _.get(state.spec, 'servers', []);
    },
    entities: state => {
      let schemas = _.get(state.spec, 'components.schemas', {});
      return Object.entries(schemas).map(([k, v]) => {
        v.name = k;
        return v;
      });
    },
  },

  mutations: {
    status(state, status) {
      state.status = status;
    },
    data(state, spec) {
      state.spec = spec;
    },
  },
  actions: {
    async fetchApi({commit}) {
      commit('status', 'fetching');
      let data = await apis.fetch();
      commit('data', data);
      commit('status', 'fetched');
    },
  },
};
export default specStore;
