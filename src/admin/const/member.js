const MEMBER_STATES = {
  FROZENED: 'frozened', // 已冻结
  UNREGISTERED: 'unregistered' // 未注册
};
const MEMBER_STATUS = {
  0: '正常', // 正常
  1: '未注册', // 未注册
  2: '冻结', // 冻结
}
// 定义成员数据默认字段
const MEMBER_DEFAULT_FIELDS = ['user_id', 'name', 'node_id', 'mobile', 'status', 'identify_code', 'reason'];
export default {
  MEMBER_STATES,
  MEMBER_STATUS,
  MEMBER_DEFAULT_FIELDS
};
