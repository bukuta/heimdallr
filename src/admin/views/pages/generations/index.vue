<template>
  <div class="page-generations">
    <el-row style="margin-bottom: 20px;">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Generations</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col>
        <el-button @click="onCreate" type="primary" icon="plus"> Add </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="items"
        >
        <el-table-column type="expand">
          <template scope="props">
            <b-generation-detail :detail="props.row"/>
          </template>
        </el-table-column>
        <el-table-column
          label="Name"
          width="180"
          >
          <template scope="scope">
            <router-link :to="{name:'modelDetail',params:{modelName:scope.row.name}}">{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="Fields"
          >
          <template scope="scope">
            <span>{{scope.row.fields.length}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="searchForm"
          >
          <template scope="scope">
            <span>{{scope.row.searchForm?scope.row.searchForm.map(item=>item.name).join(','):''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="pagination"
          >
          <template scope="scope">
            <span>{{scope.row.pagination?'yes':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="options"
          >
          <template scope="scope">
            <span>{{scope.row.options?'yes':'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateAt"
          label="updateAt"
          >
        </el-table-column>
        <el-table-column
          label="actions"
          >
          <template scope="scope">
            <el-button @click="onRemove(scope.row)" type="text">remove</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import GenerationDetail from './detail';
import GenerationCreator from './detail/creator';
import {MessageBox} from 'element-ui';

import {BaseCollection} from '$services/resources';

export default {
  components:{
    'b-generation-detail':GenerationDetail,
  },
  data(){
    return {
      loaded:false,
      status:{
        fetch:'init',
        collection:'init',
      },
      items_:[
        {
          id: 1,
          name: "Project",
          model:{
            "type": "object",
            "properties": {
              "id": {
                "$ref": "#/components/schemas/ID"
              },
              "name": {
                "type": "string",
                "x-mock": "@ctitle"
              },
              "repository": {
                "type": "string",
                "x-mock": "https://github.com/@word(6)/@word(6).git"
              },
              "creator": {
                "x-$ref": "#/components/schemas/Admin",
                "$ref": "#/components/schemas/ID"
              },
              "createAt": {
                "type": "string",
                "format": "date-time",
                "description": "创建时间",
                "x-mock": "@datetime"
              },
              "updateAt": {
                "type": "string",
                "format": "date-time",
                "description": "更新时间",
                "x-mock": "@datetime"
              }
            }
          },
          fields:[
            {
              type: 'selection'
            },
            {
              type: 'index'
            },
            {
              name: 'name',
            },
            {
              name: 'repository',
            },
            {
              name: 'updateAt',
            },
            {
              label: 'Actions'
            },
          ],
          searchForm : [
            {
              type: 'select',
              name: 'status',
              label: '状态',
              placeholder: '状态'
            },
            {
              type: 'text',
              name: 'name',
              label: '名字',
              placeholder: '名字'
            },
            {
              type: 'switch',
              name: 'online',
              label: '性别',
              placeholder: '性别'
            },
          ],
          pagination : {
            layout: "total, prev, pager, next",
            pageSizes: [10, 20, 30, 40],
            pageSize: 10,
          },
          createAt: new Date()+'',
          updateAt: new Date()+'',
        },
      ],
    };
  },
  computed:{
    items(){
      if(this.status.collection=='fetched'){
        return this.collection._items;
      }else{
        return [];
      }
    },
  },
  mounted(){
    this.collection = new BaseCollection({url:'generations'});
    this.fetchItems();
  },
  methods:{
    fetchItems(){
      this.status.collection='fetching';
      this.collection.fetch().then(rs=>{
        this.status.collection = 'fetched';
      });
    },
    onCreate(){
      let content = <GenerationCreator key={'creator_'+Date.now()} model={this.items_[0].model}/>;
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
          data.type='list';// list/detail
          data.model=this.items_[0].model;
          data.name=this.items_[0].name;
          this.collection.create(data).then(rs=>{
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
    onRemove(item){
      this.$confirm('this will remove the item forever,are you sure?','Warning',{type:'warning'}).then(rs=>{
        this.collection.select(item.id).destory().then(rs=>{
          this.$message({
            type:'success',
            message:'success',
          });
        });
      })
    },
  },
};;
</script>
<style lang="less">
.dialog-generation-creator{
  width: 800px;
}
</style>
