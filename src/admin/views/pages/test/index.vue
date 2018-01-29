<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/test'}">测试</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/test/cases'}">用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>用例详情</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view>
    </router-view>
  </div>
</template>
