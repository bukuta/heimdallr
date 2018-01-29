<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/apis/list'}">Api List</el-breadcrumb-item>
      <el-breadcrumb-item>Api Detail</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view>
    </router-view>
  </div>
</template>
<script>
export default{
  name:'api-base',
  data(){
    return {};
  },
};

</script>
