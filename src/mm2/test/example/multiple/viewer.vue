<template>
  <div>
    <form-builder :entity="entity" :data="data" :shape="shape" />
  </div>
</template>
<script>
import {ResourceViewer} from '$mould/view-builder';

import AddressPool from '$mould/resources/addresspool/entity.js';
import data from '$mould/resources/addresspool/data.js';
import ViewShape  from '$mould/resources/addresspool/shapes/viewer.js';

export default {
  components:{
    'form-builder':ResourceViewer,
  },
  data(){
    return {data:data,entity:AddressPool,shape:ViewShape};
  },
};


</script>
