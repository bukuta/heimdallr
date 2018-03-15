import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import authorizeService from '$app/services/authorize';

import Auth, { Signin } from '$pages/auth';
import Home from '$pages/home';
import Generations from '$pages/generations';
import Configs from '$pages/settings';

import { routes as apiRoutes } from '$pages/apis';
import { routes as testRoutes } from '$pages/test';

import getRoutes from '$mouldtest/example/index.js';

function renccc(){
  return <div>renccc</div>
}

const routes = [
  // 定义路由
  {
    path: '/',
    component: Home,
    redirect: '/home',
    meta: {
      title: '首页-Console'
    },
  },
  {
    path: '/login',
    component: Signin,
    meta: {
      title: '登录-Console',
      menuType: 'auth'
    },
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页-Console'
    }
  },
  {
    path: '/generations',
    component: Generations,
    meta: {
      title: 'Generations-Console'
    }
  },
  {
    path: '/configs',
    component: Configs,
    meta: {
      title: 'configs-Console'
    }
  },
  Object.assign(apiRoutes, {
    path: '/apis'
  }),
  //Object.assign(testRoutes, {
    //path: '/test'
  //}),
  getRoutes(),
  {
    path: '/*',
    component: Home,
    beforeEnter: (to, from, next) => {
      next();
    }
  }
];

function getOriginProps(route){
  let props = route.props;
  let propsType = typeof(props);
  return function(route){
    console.log('getOriginProps');
    if(propsType=='object'){
      return props;
    }
    if(propsType=='function'){
      return props(route);
    }
    return {};
  };
}

function injectProps(route){
  let rawProps = route.props;
  let props = getOriginProps(route);
  route.props = function(route){
    let r = {};
    let items = route.meta&&route.meta.injectProps;
    if(items){
      items.forEach(item=>{
        let key = genCachedKey(item,route);
        let value = cache.get(key);
        if(typeof(value)!='undefined'){
          r[item.name]=value;
        }
      });
    }
    let _props = props(route);
    r = Object.assign({},route.params,_props,r);
    return r;
  };

  if(route.children){
    route.children.map(r=>{
      injectProps(r);
    });
  }
}


routes.map(route=>{
  injectProps(route);
});

const router = new Router({ // 创建路由实例
  mode: 'history',
  routes: routes
});


let cache = {
  _cache:{},
  get(key){
    console.log('cache.get',key,this._cache[key]);
    return this._cache[key];
  },
  set(key,value){
    let type = typeof(key)
    console.log('cache.set',key,value);
    if(({'number':1,'string':1,'boolean':1})[type]){
      this._cache[key]=value;
    }else{
      throw new Error('not support cached key type:',type);
    }
  }
};
import {apiDetail} from '$app/services/resources/injector.js';
let injectors={
  apiDetail,
};

function getInjector(name) {
  return function() {
    if(injectors[name]){
      return injectors[name].apply(null,[...arguments]);
    }
    let args = [].slice.call(arguments, 0);
    return Promise.resolve([name,...args]);
  };
}

function genCachedKey(inject, route) {
  let key = '';
  console.log('genCachedKey',inject)
  key = `${inject.injector}(${inject.params.map(name => [name, route.params[name]].join('=')).join(',')})`;
  return key;
}

window.cache = cache;

router.beforeEach((to, from, next) => {
  let ps = [];
  if (to.meta && to.meta.injectProps) {
    let injectPromises = to.meta.injectProps.map(inject => {
      let params = inject.params.map(name => to.params[name]);
      let injector = getInjector(inject.injector);
      let cached_key = genCachedKey(inject, to);
      console.warn('cached_key', cached_key);
      let promise = injector.apply(null, params).then(rs => {
        // cached result
        cache.set(cached_key,rs);
        return rs;
      });
      return promise;
    });
    ps = ps.concat(injectPromises);
  }

  Promise.all(ps).then(all => {
    return next();
  }, err => {
    next(err);
  });

});

router.beforeEach((to, from, next) => {
  console.log('router.beforeEach', to, from);
  if (to && to.meta && to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Monitor&Console';
  }
  next();
});

export default router;
