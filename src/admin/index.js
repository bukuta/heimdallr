import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import _ from 'lodash';
import Vuex from 'vuex';
import vuexModules from './config/vuexModules';

import filters from './filters.js';
for(let [name,filter] of Object.entries(filters)){
  Vue.filter(name,filter);
}

import App from './app.vue';
import router from './router';

Vue.use(ElementUI);
Vue.use(Vuex);
// 严格模式
// 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，
// 将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: vuexModules,
  strict: debug
});

new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app');
