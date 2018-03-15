<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceModifier} from '$mould/view-builder';

import AddressPool from '$mould/resources/addresspool/entity.js';
import data from '$mould/resources/addresspool/data.js';
import CreateShape  from '$mould/resources/addresspool/shapes/create.js';

export default {
  components:{
    'form-builder':ResourceModifier,
  },
  data(){
    return {data:data,entity:AddressPool,shape:CreateShape};
  },
};


</script>
