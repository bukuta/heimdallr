<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceModifier} from '$mould/view-builder';

import Service from '$mould/resources/vpnservice/entity.js';

import data from '$mould/resources/vpnservice/data.js';
import CreateShape  from '$mould/resources/vpnservice/shapes/create.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:data,entity:Service,shape:CreateShape};
  },
};


</script>
