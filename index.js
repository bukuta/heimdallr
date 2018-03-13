const path = require('path');

module.exports = {
  absolutePath(){
    return path.resolve(__dirname,'./dist/release');
  },
};
