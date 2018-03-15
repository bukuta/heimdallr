<template>
  <div>
    <form-builder ref='form' :entity="entity" :data="data" :shape="shape" />
    <el-button @click='submit'>submit</el-button>
  </div>
</template>
<script>
import {ResourceModifier} from '$mould/view-builder';

import Device from '$mould/resources/device/entity.js';
import data from '$mould/resources/device/data.js';
import CreateShape from '$mould/resources/device/shapes/create.js';
import ViewShape from '$mould/resources/device/shapes/view.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:data,entity:Device,shape:CreateShape};
  },
  methods:{
    submit(){
      console.log(this.$refs.form.getValue(),data);

    },
  },
};


</script>
