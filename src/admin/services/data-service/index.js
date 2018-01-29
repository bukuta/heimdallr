//import DataProvider from '@bbfe/data-provider';
import DataProvider from './DataProvider.js'

// 创建一个DataProvider实例
var service = new DataProvider();

var DataService = {
  request: function (config) {
    let mixedConfig = {
      ...config
    };
    return service.request(mixedConfig);
  },
};

export default DataService;
