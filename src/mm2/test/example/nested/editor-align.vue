<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceModifier} from '$mould/view-builder';

import  Device  from '$mould/resources/device/entity.js';
import  data  from '$mould/resources/device/data.js';
import CreateShape from '$mould/resources/device/shapes/create-align.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:data,entity:Device,shape:CreateShape};
  },
};


</script>
