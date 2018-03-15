function rpc(subpath, method) {
  //console.log('rpc', arguments);
  return function decorator(target, name, descriptor) {
    //console.log('decorator', arguments);
    let fun = descriptor.value;
    descriptor.value = function newValue() {
      //console.log(name, '', arguments);
      let rs = fun.apply(this, [].slice.call(arguments))
      rs.method = method || 'POST';
      if(subpath.startsWith('^/')){
        rs.path=subpath.slice(1);
      }else{
        rs.path = '/' + (this.url + subpath).split('/').filter(a => a).join('/');
      }
      return this._fetch(rs);
    };
    return descriptor;
  };
}

export { rpc };
