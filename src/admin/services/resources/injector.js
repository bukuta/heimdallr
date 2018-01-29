import { Apis} from '$app/services/resources';
import {unescapeURI} from '$app/utils';

let apis = new Apis();

function apiDetail(apiPath,apiMethod){
  return apis.fetch().then(({items})=>{
    console.log('apiDetail',items);
    apiPath=unescapeURI(apiPath);
    let r = items.filter(item=>{
      return item.path==apiPath&&item.method==apiMethod;
    });
    console.log('apiDetail',apiPath,apiMethod,r);
    return r[0];
  });
}
export {apiDetail};
