const urllib = require('url');
const pathlib = require('path');

const mime = require('mime');

class DataProvider{
  constructor(options={base:'/api/v1'}){
    console.log('new Dataprovider',...arguments);
    this._base = options.base;
  }
  request(options){
    console.log('rquest',...arguments);
    let {url,path,query} = options;
    let urlobj = urllib.parse(url||path);
    if(query&&typeof(query)=='object'){
      urlobj.query=Object.assign(urlobj.query||{},query);
    }
    if(urlobj.pathname.indexOf(this._base)==-1){
      urlobj.pathname = pathlib.join(this._base,urlobj.pathname);
    }
    url = urllib.format(urlobj);
    console.log('request',url);
    options.url = url;

    options.headers = Object.assign({'Accept':'application/josn'},options.headers);

    return fetch(url,options).then(res=>{
      console.log(res);
      console.log(res.headers);
      let statusSeries = parseInt(res.status/100,10);
      let contentType =res.headers.get('content-type');
      let extension = mime.getExtension(contentType);
      if(statusSeries ==2){
        if(extension=='json'){
          return res.json();
        }else if(extension=='text'){
          return res.text();
        }

      }else if(statusSeries==4){
        if(extension=='json'){
          return res.json().then(error=>{
            let e = new Error(res.status);
            e.detail = error;
            if(error.message){
              e.message = error.message
            }
            throw e;
          });
        }else if(extension=='text'||extension=='html'){
          return res.text().then(message=>{
            let e =  new Error(res.status);
            e.message = message;
            throw e;
          });
        }
      }
      return res;
    });
  }
}

export default DataProvider;

