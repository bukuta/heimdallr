<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceViewer}from '$mould/view-builder';

import Device from '$example/resources/device/entity.js';
import deviceData from '$example/resources/device/data.js';
import DeviceCreateShape from '$example/resources/device/shapes/create.js';
import DeviceViewShape from '$example/resources/device/shapes/view.js';

import utils from '$mould/view-builder/utils.js';
console.log(utils);
//import { getInitData } from '$mould/view-builder/utils.js';

let init = utils.getInitData(Device);
console.log('init',init);

export default {
  components:{
    'form-builder':ResourceViewer,
  },
  data(){
    return {data:init,entity:Device,shape:DeviceViewShape};
  },
};


</script>
