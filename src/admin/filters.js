import Mock from 'mockjs';
let filters= {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  upper: function (value) {
    if (!value) return ''
    return value.toString().toUpperCase();
  },
  mock: function(template){
    return Mock.mock(template);
  },
  codeFormat: function(value){
    return JSON.stringify(value,0,2);
  }
};
export default filters;

