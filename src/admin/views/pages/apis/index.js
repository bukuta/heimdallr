import {unescapeURI}from '$utils';
import ApiBase from './index.vue'
import ApiList from './list'
import ApiDetail from './detail'

import Entities from './entities'
import Tags from './tags'
import { Apis} from '$app/services/resources';

let apis = new Apis();

const routes = {
  path: '/base',
  component: ApiBase,
  meta: {
    title: 'API管理-Console'
  },
  children: [
    {
      path: 'list',
      component: ApiList,
      name: 'apiList',
      meta: {
        title: 'API列表-Console'
      },
      props: function(route){
        console.log(route);
        return Object.assign({},route.params,{apis:apis});
      },
    },
    {
      path: 'tags',
      component: Tags,
      name: 'tags',
      meta: {
        title: '标签列表-Alodi'
      },
      props: function(route){
        console.log(route);
        return Object.assign({},route.params,{apis:apis});
      },
    },
    {
      path: 'entities',
      component: Entities,
      name: 'entities',
      meta: {
        title: '实体列表-Console'
      },
      props: function(route){
        console.log(route);
        return Object.assign({},route.params,{apis:apis});
      },
    },
    {
      path: ':apiPath/:apiMethod',
      component: ApiDetail,
      name: 'apiDetail',
      meta: {
        title: 'API详情-Console',
        injectProps:[
          {
            name: 'detail',
            injector: 'apiDetail',
            params:['apiPath','apiMethod'],
          },
        ],
      },
      props: function(route){
        console.log(route);
        let apiPath = unescapeURI(route.params.apiPath);
        return Object.assign({},route.params,{apiPath,apis:apis});
      },
    },
    {
      path: '*',
      redirect: '/home'
    },
  ],
}
export { routes };
