export default {
  convertDay(row, column, value) {
    value = parseInt(value);
    switch (value) {
      case 1:
        return '一天';
      case 7:
        return '一周';
      case 30:
        return '一个月';
      case 90:
        return '三个月';
      case 365:
        return '一年';
      case 65525:
        return '永久';
      default: return '参数错误';
    }
  },
  convertIP(row, column, value) {
    return `${value[0]}`;
  },
  getOrderStatusText(text) {
    return '';
  }
};

function escapeURI(url) {
  return '(' + url.replace(/\//g, '>') + ')';
}
function unescapeURI(url) {
  return url.split(/[()]/).filter(a=>a).join('').replace(/>/g, '/');
}

export { escapeURI, unescapeURI };
