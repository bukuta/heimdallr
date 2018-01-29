import MEMBER_CONSTS from './member';
const { MEMBER_STATES } = MEMBER_CONSTS;

export const OPERATION_STAUS = {
  NOOP: 'noop',
  PENDING: 'pending',
  FULLFILED: 'fullfiled'
};

export const ORGANIZATION_TYPES = {
  COMPANY: {
    key: 'company',
    title: '单位'
  }, // 单位
  DEPARTMENT: {
    key: 'department',
    title: '部门'
  } // 部门
};

// 字段映射
export const ORGANIZATION_ATTR_MAP = {
  id: 'node_id', // 分支id
  parentId: 'parent_id', // 父分支id  
  name: 'name', // 名称
  children: 'children', // 子分支
  category: 'category', // 分支类别
  isCCP: 'is_CCP', // 是否党组织
  code: 'node_code', // 分支编号
  seq: 'node_seq', // 分支序号
  adminIds: 'admin_id', // 管理员
  descendentCounts: 'child_count', // 后代分支数量
  allMemberCounts: 'member_count', // 所有成员数量, 包含后代分支
  directlyMemberCounts: 'directly_count', // 直属成员数量
  [`${MEMBER_STATES.FROZENED}MemberCounts`]: 'frozened_count', // 直属成员中：冻结成员数量
  [`${MEMBER_STATES.UNREGISTERED}MemberCounts`]: 'unregistered_count' // 直属成员中：未注册成员数量
};

export default {
  OPERATION_STAUS,
  ORGANIZATION_TYPES,
  ORGANIZATION_ATTR_MAP
};
