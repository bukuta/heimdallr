<template>
  <div class="page-api-list">
    <el-row style="margin-top: 10px; display:flex;">
      <el-col :span="2">
        TAGS:
      </el-col>
      <el-col :span="22">
        <el-checkbox-group v-model="filters.tags">
          <el-checkbox-button v-for="tag in itemsGroupByTag" :label="tag.name" :key="tag.name">{{tag[tagField]}}</el-checkbox-button>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;display:flex;">
      <el-col :span="2">
        METHODS:
      </el-col>
      <el-col :span="22">
        <el-checkbox-group v-model="filters.methods">
          <el-checkbox-button v-for="item in methods" :label="item" :key="item">{{item}}</el-checkbox-button>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px; margin-bottom: 10px; display:flex;">
      <el-col :span="2">
        SERVERS:
      </el-col>
      <el-col :span="22">
        <el-checkbox-group v-model="filters.servers">
          <el-checkbox-button v-for="item in servers" :label="item.name" :key="item.name">{{item.name}}[{{item.url}}]</el-checkbox-button>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-table
      :data="filteredItems"
      :row-class-name="tableRowClassName"
      >
      <el-table-column type="expand">
        <template scope="props">
          <b-api-detail :detail="props.row" :apiPath="props.row.path" :apiMethod="props.row.method"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="method"
        label="METHOD"
        width="180"
        >
        <template scope="scope">
          <span :class="'api-method api-method-'+scope.row.method">
            {{scope.row.method|upper}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="PATH"
        class="api-path"
        >
      </el-table-column>
      <el-table-column
        prop="description"
        label="description"
        class="api-summary"
        >
      </el-table-column>
      <el-table-column
        label="Tags"
        class="api-summary"
        width="160"
        >
        <template scope="scope">
          <el-tag class="" :key="tag.name" v-for="tag in scope.row.tags">
            {{tag}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="proxy"
        class="api-summary"
        width="260"
        >
        <template scope="scope">
          <el-row>
            <el-col>
              <el-select :key="scope.row.method+'_'+scope.row.path" v-model="scope.row['x-server']" @change="proxyIt(scope.row)"placeholder="请选择">
                <el-option
                  v-for="item in servers"
                  :key="item.name"
                  :label="item.name"
                  :value="item.url">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.url }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

import {escapeURI} from '$utils';
import ApiDetail from '../detail';

export default {
  name: 'api-list',
  props:[ 'apis', ],
  components:{
    'b-api-detail':ApiDetail,
  },
  data(){
    return {
      methods:['GET','POST','PUT','PATCH','DELETE','HEAD','OPTION'].map(a=>a.toLowerCase()),
      tagField:'name',
      filteredItems:[],
      filters:{
        tags:[],
        methods:[],
        servers:[],
      },
    };
  },
  computed:{
    ...mapGetters('specStore',{
      paths:'paths',
      itemsGroupByTag: 'tags',
      servers: 'servers',
    }),
    items(){
      return this.paths&&this.paths.items;
    },
    tags(){
      return Object.keys(this.itemsGroupByTag);
    },
  },
  watch:{
    'items':function(){
      this.updateFilteredItems();
    },
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
    this.updateFilteredItems();
    let items = [
      {to:{path:'/'},label:'Home'},
      {to:{path:'/apis/list'},label:'APILIST'},
    ];
    this.$emit('breadcrumb',items);
    //this.fetchItems();
  },
  methods:{
    updateFilteredItems(){
      console.warn('filteredItems',this.itemsGroupByTag, this.currentServer);
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
    tableRowClassName(row,index){
      return 'api-row api-row-'+row.method;
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
</style>
