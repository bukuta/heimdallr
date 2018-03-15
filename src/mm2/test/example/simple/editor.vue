<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceModifier} from '$mould/view-builder';

import Device from '$example/resources/device/entity.js';
import data from '$example/resources/device/data.js';
import EditShape from '$example/resources/device/shapes/edit.js';
import ViewShape from '$example/resources/device/shapes/view.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:data, entity:Device, shape:EditShape};
  },
};


</script>

