<template>
  <div>
    <form-builder ref='form' :entity="entity" :data="data" :shape="shape" />
    <el-button @click="submit"></el-button>
  </div>
</template>
<script>
import {ResourceViewer,ResourceModifier} from '$mould/view-builder';

import Sites  from '$mould/resources/site/entity.js';

import Admin  from '$mould/resources/admin/entity.js';
import data from '$mould/resources/admin/data.js';

import CreateShape from '$mould/resources/admin/shapes/edit.js';
import ViewShape from '$mould/resources/admin/shapes/view.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:data,entity:Admin,shape:CreateShape};
  },
  methods:{
    submit(){
      console.log(this.$refs.form.getValue());

    }
  },
};


</script>
