<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item v-for="item of items"  :to="item.to">{{item.label}}</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view @breadcrumb="onBreadcrumb">
    </router-view>
  </div>
</template>
<script>
export default{
  name:'api-base',
  data(){
    return {
      items:[],
    };
  },
  methods:{
    onBreadcrumb(items){
      console.log('onBreadcrumb',items);
      this.items = items;
    },
  },
};

</script>
