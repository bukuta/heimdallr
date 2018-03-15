<template>
  <div :class="'page-api-detail page-api-detail-'+apiMethod">
    <el-row class="page-header">
      <el-col :span="4" :class="'api-method api-method-'+apiMethod">
        {{apiMethod|upper}}
      </el-col>
      <el-col :span="16" class="api-path">
        {{apiPath}}
        <span style="font-weight: 200; color: #999; margin-left: 20px;">{{detail.summary}}</span>
      </el-col>
      <el-col :span="4">
        <el-switch v-model="detail.isSkip">SKIP</el-switch>
        <el-dropdown split-button type="primary" @click="onApiConfig">
          配置
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>开发模式</el-dropdown-item>
            <el-dropdown-item>联调模式</el-dropdown-item>
            <el-dropdown-item>测试模式</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row style="">
      <el-col>
        {{detail.description}}
      </el-col>
    </el-row>
    <el-row style="">
      <el-col> Parameters </el-col>
    </el-row>
    <el-row style="">
      <el-col>
        <el-table
          :data="detail.parameters"
          >
          <el-table-column
            label="Name/Type"
            >
            <template scope="scope">
              <span>
                <span style="font-weight: bold; font-size: 20px;">{{scope.row.name}}</span>:{{scope.row.type}} <span v-if="scope.row.required" style="color:red;">*required</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="in"
            label="From"
            >
          </el-table-column>
          <el-table-column
            prop="description"
            label="Description"
            >
          </el-table-column>
          <el-table-column
            prop="x-mock"
            label="Mock"
            >
          </el-table-column>
          <el-table-column
            prop="x-mock"
            label="mock"
            >
            <template scope="scope">
              <span>
                {{scope.row['x-mock']|mock}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="detail.requestBody" style="">
      <el-col> RequestBody </el-col>
    </el-row>
    <el-row v-if="detail.requestBody">
      <el-col class="">
        <el-select v-model="contentType" v-if="detail.requestBody.content">
          <el-option :key="contentType" :label="contentType" :value="contentType" v-for="[contentType,content] of Object.entries(detail.requestBody.content||{})"/>
        </el-select>
      </el-col>
    </el-row>
    <div v-if="detail.requestBody" >
      <el-row :key="contentType" v-for="[contentType,content] of Object.entries(detail.requestBody.content||{})">
        <el-col class="request-schema">
          <pre>{{ content.schema|codeFormat }} </pre>
      </el-col>
    </el-row>
  </div>
    <el-row style="">
      <el-col> Responses </el-col>
    </el-row>
    <el-row style="">
      <el-col>
        <el-table
          :data="detail.responses"
          >
          <el-table-column
            prop="code"
            label="Code"
            width="120"
            >
          </el-table-column>
          <el-table-column
            label="Description"
            >
            <template scope="scope">
              <div>
                <b-response :response='scope.row'/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="x-mock"
          label="Mock"
          width="300"
          >
          <template scope="scope">
            <el-switch v-model="scope.row.isSkip">SKIP</el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</div>
  </template>
  <script>
import Response from './response.vue';
export default {
  name: 'api-detail',
  props:[
    'apiPath',
    'apiMethod',
    'detail',
  ],
  components:{
    'b-response':Response,
  },
  data(){
    return {
      detail_: {
        path: '/users/:userId',
        method: 'get',
        description: '获取单个用户信息',
        summary: 'fetchUser',
        parameters:[
          {
            name: 'userId',
            type: 'integer',
            required: true,
            in: 'path',
            'x-mock': '@integer(0,1000)',
            description: '用户ID',
          },
        ],
        responses:[
          {
            code: 200,
            headers:{
              'set-cookie':'userid=""',
              'token':'',
            },
            description: 'OK',
            content:{
              'application/json':{
                schema:{
                  type: 'object',
                  properties:{
                    id:{
                      type: 'integer',
                      description: 'ID',
                      'x-mock':'@integer(0,10000)',
                    },
                    name:{
                      type: 'string',
                      description: '名字',
                      'x-mock':'@cname',
                    },
                  },
                },
              }
            },
          },
          {
            code: 404,
            description: 'Not Found',
          },
        ],
      },
      contentType:'',
    };
  },
  created(){
    console.log('lifecycle.created.apiDetail',this.apiPath);
  },
  mounted(){
    console.log('lifecycle.mounted.apiDetail',this.apiPath);
  },
  updated(){
    console.log('lifecycle.updated.apiDetail',this.apiPath);
  },

  methods:{
    onApiConfig(){
      console.log('onapiconifg',...arguments);
    },
  },
}
</script>
<style lang="less">
@color-head: #61affe;
@color-get: #61affe;
@color-post: #49cc90;
@color-put: #50e3c2;
@color-patch: #50e3c2;
@color-delete: #f93e3e;

.pageApiDetailMethod(@method){
  @color: "color-@{method}";
  &.page-api-detail-@{method}{
    background: fade(@@color,10%);
    border: 1px solid fade(@@color, 50%);
    .page-header {
      border-bottom: 1px solid fade(@@color, 50%);
      .api-method-@{method}{
        background: @@color;
      }
    }
  }
}
.page-api-detail{
  margin-top: 20px;

  .pageApiDetailMethod(head);
  .pageApiDetailMethod(get);
  .pageApiDetailMethod(post);
  .pageApiDetailMethod(put);
  .pageApiDetailMethod(patch);
  .pageApiDetailMethod(delete);

  .page-header{
    height: 60px;
    line-height: 60px;

    .api-method{
      margin: 0 15px;
      padding: 4px 10px;
      border-radius: 4px;
      width: 100px;
      height: 30px;
      vertical-align: middle;
      display: block;
      text-align: center;
      color: white;
      margin-top: 15px;
      line-height: 20px;
      font-weight: 400;
    }
    .api-path{
      font-weight: bold;
    }
  }
  .el-row{
    margin: 10px 0;
    padding: 0 10px;
  }
  .request-schema{
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
