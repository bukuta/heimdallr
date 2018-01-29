<template>
  <div class="page-case-detail">
    <el-row>
      <el-col :span="24">
        <b>修改用户信息</b>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        用例说明
      </el-col>
      <el-col :span="20">
          描述一个用户场景，比如获取用户个人中心页面数据
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        接口调用流程
      </el-col>
      <el-col :span="20">
          登录->获取用户信息->修改用户信息->验证修改结果->恢复用户信息
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less">
.page-case-detail{
  padding: 20px;
  .el-row{
    margin: 20px 0;
  }
}
</style>
