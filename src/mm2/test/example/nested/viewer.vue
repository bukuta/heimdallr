<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceViewer} from '$mould/view-builder';

import Device from '$mould/resources/device/entity.js';
import data from '$mould/resources/device/data.js';
import CreateShape from '$mould/resources/device/shapes/create.js';
 import  ViewShape from '$mould/resources/device/shapes/view.js';

export default {
  components:{
    'form-builder':ResourceViewer,
  },
  data(){
    return {data:data,entity:Device,shape:ViewShape};
  },
};


</script>
