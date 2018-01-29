<template>
  <div class="page-api-list">
    <el-row style="padding: 20px 0;">
    </el-row>
    <el-table
      :data="items"
      :row-class-name="tableRowClassName"
      >
      <el-table-column type="expand">
        <template scope="props">
          <div>
            <el-table
              v-if="props.row.properties"
              :data="Object.entries(props.row.properties)"
              >
              <el-table-column
                label="Name"
                width="180"
                >
                <template scope="scope">
                  {{scope.row[0]}}
                  <span v-if="scope.row[1].required" style="color:red;">
                    required
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="description"
                width="180"
                >
                <template scope="scope">
                  {{scope.row[1].description}}
                </template>
              </el-table-column>
              <el-table-column
                label="type"
                width="180"
                >
                <template scope="scope">
                  {{scope.row[1].type}}
                </template>
              </el-table-column>
              <el-table-column
                label="mock"
                >
                <template scope="scope">
                  {{apis.collectionMock(scope.row[1],scope.row[0])}}
                </template>
              </el-table-column>
            </el-table>
            <pre v-if="!props.row.properties">{{JSON.stringify(props.row,0,2)}}
            </pre>
          </div>
        </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Name"
          width="180"
          >
        </el-table-column>
        <el-table-column
          prop="type"
          label="TYPE"
          >
        </el-table-column>
        <el-table-column
          prop="description"
          label="description"
          >
        </el-table-column>
        <el-table-column
          label="properties"
          class="api-summary"
          >
          <template scope="scope">
            <span >
              {{Object.keys(scope.row.properties||{}).length||'-'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="action"
          class=""
          >
          <template scope="scope">
            <el-button @click="onCreateGeneration(scope.row)" type="text">list</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>

  <script>

import {escapeURI} from '$utils';
import {BaseCollection} from '$services/resources';
import { Apis} from '$app/services/resources';
import ApiDetail from '../detail';

import GenerationCreator from '$pages/generations/detail/creator';
import {MessageBox} from 'element-ui';

export default {
  name: 'api-list',
  props:[
    'apis',
    ],
  components:{
    'b-api-detail':ApiDetail,
  },
  data(){
    return {
      loaded:false,
      items:[],
      itemsGroupByTag:{},
      tags:[],
      methods:['GET','POST','PUT','PATCH','DELETE','HEAD','OPTION'].map(a=>a.toLowerCase()),
      servers:[],
      tagField:'name',
      filteredItems:[],
      filters:{
        tags:[],
        methods:[],
        servers:[],
      },
    };
  },
  watch:{
    'filters.tags':function(){
      this.updateFilteredItems();
    },
    'filters.methods':function(){
      this.updateFilteredItems();
    },
    'filters.servers':function(){
      this.updateFilteredItems();
    },
  },
  mounted(){
    this.generations = new BaseCollection({url:'/generations'});
    this.fetchItems();
  },
  methods:{
    updateFilteredItems(){
      console.warn('filteredItems',this.loaded);
      if(!this.loaded){
        return [];
      }
      let items = this.items;
      let tags = {};
      let methods={};
      let servers={};
      if(this.filters.tags.length){
        this.filters.tags.forEach(name=>tags[name]=1);
      }else{
        this.tags.forEach(name=>tags[name]=1);
      }
      if(this.filters.methods.length){
        this.filters.methods.forEach(name=>methods[name]=1);
      }else{
        this.methods.forEach(name=>methods[name]=1);
      }
      if(this.filters.servers.length){
        this.filters.servers.forEach(name=>servers[this.servers[name].url]=1);
      }else{
        Object.values(this.servers).forEach(s=>servers[s.url]=1);
      }
      console.warn('filters',tags,methods,servers);
      this.filteredItems = items.filter(item=>{
        return methods[item.method]
          &&item.tags&&item.tags.filter(tag=>tags[tag]).length
          &&servers[item['x-server']]
      });
    },
    fetchItems(){
      let apis = this.apis;
      apis.fetch().then(rs=>{
        console.log('fetchApis.',rs);
        this.loaded=true;
        //this.items = rs.items;
        this.items = apis.getEntities();
        this.filteredItems=rs.items;
        let tags = apis.groupByTags();
        this.itemsGroupByTag=tags;
        this.tags = Object.keys(tags);
        this.servers = apis.getServers();
      });
    },
    tableRowClassName(row,index){
      return 'api-row api-row-'+row.method;
    },
    onCreateGeneration(item){
      let content = <GenerationCreator key={'creator_'+Date.now()} model={item}/>;
      MessageBox({
        customClass:'dialog-generation-creator',
        title:"Add Generation",
        message: content,
        showCancelButton:true,
        beforeClose:(action,instance,done)=>{
          console.log(content.componentInstance);
          if(action=='cancel'){
            return done();
          }
          let data = content.componentInstance.getValue();
          console.log(data);
          data.model=item;
          data.name=item.name;
          this.generations.create(data).then(rs=>{
            this.$message({
              type: 'success',
              message: 'success',
            });
            done();
          },err=>{
            this.$message({
              type: 'error',
              message: 'failed'+err.message,
            });
          });
        },
      }).then(rs=>{
        console.log(rs);
      })
    },
    proxyIt(item){
      console.warn(item);
      let {path,method}=item;
      this.apis.proxyIt({
        path,
        method,
        proxy:item['x-server'],
        proxyEnable:item['x-proxyEnable'],
      }).then(rs=>{
        this.$message({
          type:'success',
          message: 'ok',
        });
      },err=>{
        this.$message({
          type:'error',
          message: 'oh no',
        });
      });
    },
    showDetail(item){
      this.$router.push({
        name:'apiDetail',
        params:{
          // /users/:userId ==>
          // _users_:userId
          // @users@:userId

          // ~users~:userId
          // $users$:userId
          // %users%:userId  no
          // ^users^:userId
          // !users!:userId
          // *users*:userId
          // >users>:userId   ok
          // |users|:userId   ok
          // <users<:userId
          // (users(:userId
          // ()users():userId  ok
          // (>)users(>):userId  ok
          // (|)users(|):userId  ok
          apiPath: escapeURI(item.path),
          apiMethod: item.method,
        },
      });
    },
  }
};
</script>
<style lang="less">
@color-head: #61affe;
@color-get: #61affe;
@color-post: #49cc90;
@color-put: #50e3c2;
@color-patch: #50e3c2;
@color-delete: #f93e3e;
.page-api-list{
  .api-row{
    &.api-row-get{
      background: fade( @color-get , 10%);
    }
    &.api-row-post{
      background: fade(@color-post,10%);
    }
    &.api-row-put{
      background: fade(@color-put,10%);
    }
    &.api-row-patch{
      background: fade(@color-patch,10%);
    }
    &.api-row-delete{
      background: fade(@color-delete,10%);
    }

    .api-method{
      padding: 4px 10px;
      border-radius: 4px;
      width: 100px;
      display: block;
      text-align: center;
      color: white;
      font-weight: 400;
    }

    .api-method-get{
      background: @color-get;
    }
    .api-method-post{
      background: @color-post;
    }
    .api-method-put{
      background: @color-put;
    }
    .api-method-patch{
      background: @color-patch;
    }
    .api-method-delete{
      background: @color-delete;
    }

    .api-path{
      font-weight: bold;
    }
  }
}
.dialog-generation-creator{
  width: 800px;
}

</style>
