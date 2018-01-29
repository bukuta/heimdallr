<template>
  <div class="page-api-response">
    <el-row>
      <el-col class="response-description">
        {{response.description}}
      </el-col>
    </el-row>
    <el-row v-if="response.content">
      <el-col class="">
        <el-select v-model="contentType" v-if="response.content">
          <el-option :key="contentType" :label="contentType" :value="contentType" v-for="[contentType,content] of Object.entries(response.content||{})"/>
        </el-select>
      </el-col>
    </el-row>
    <div>
      <el-row v-for="[contentType,content] of Object.entries(response.content||{})">
        <el-col class="response-schema">
          <pre>{{ content.schema|codeFormat }} </pre>
      </el-col>
    </el-row>
  </div>
</div>
</template>
<script>
export default {
  name: 'api-responses',
  props:[
    "response"
  ],
  data(){
    let type = this.response.content&&Object.keys(this.response.content)[0];
    return {
      contentType: type,
    };
  },

};
</script>
<style lang="less">
.page-api-response{
  .response-description{
    font-size: 12px;
    font-style: italic;
    display: block;
    margin: 0;
    padding: 10px;
    border-radius: 4px;
    background: #41444e;
    font-family: Source Code Pro,monospace;
    font-weight: 600;
    color: #fff;
  }
  .response-schema{
    font-size: 12px;
    display: block;
    margin: 0;
    padding: 10px;
    border-radius: 4px;
    background: #41444e;
    font-family: Source Code Pro,monospace;
    font-weight: 600;
    color: #fff;
  }
}
</style>
