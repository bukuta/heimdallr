<template>
  <div>
    <form-builder ref='form' :entity="entity" :data="data" :shape="shape" />
    <el-button @click="submit">提交</el-button>
  </div>
</template>
<script>
import {ResourceModifier} from '$mould/view-builder';

import Device from '$example/resources/device/entity.js';
import deviceData from '$example/resources/device/data.js';
import DeviceCreateShape from '$example/resources/device/shapes/view.js';
import DeviceViewShape from '$example/resources/device/shapes/view.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:{},entity:Device,shape:DeviceCreateShape};
  },
  methods:{
    submit(){
      let form = this.$refs.form
      console.log(form.getValue());
    },
  },
};

</script>


