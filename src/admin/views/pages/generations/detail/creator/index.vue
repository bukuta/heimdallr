<template>
  <div class="piece-generation-creator" style="">
    <el-row>
      <el-col>
        <el-row>
          <el-col :span="24">
            <el-form
              label-position="left"
              label-width="120px">
              <el-form-item label="title">
                <el-input v-model="title"/>
              </el-form-item>
              <el-form-item label="parts">
                <el-checkbox-group v-model="currentParts">
                  <el-checkbox v-for="item in parts" :label="item.name" :key="item.name">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="properties"
            @selection-change="handleSelectionChange"
            height="300"
            >
            <el-table-column
              type="selection"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="Name"
              >
            </el-table-column>
            <el-table-column
              prop="type"
              label="Type"
              >
            </el-table-column>
            <el-table-column
              label="Index"
              >
              <template scope="scope">
                <el-button icon="el-icon-sort-up" type="text">↑</el-button>
                <el-button icon="el-icon-sort-down" type="text">↓</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="Searchable"
              v-if="canSearch"
              >
              <template scope="scope">
                <el-switch
                  v-model="searchForm[scope.row.name]"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row v-if="canPagination" style="margin: 20px 0 10px;">
          <el-checkbox-group v-model="pagination.layout">
            <el-checkbox v-for="item in layouts" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
        <el-row v-if="canPagination">
          <el-pagination
            :layout="emulator.layout.join(',')"
            :page-sizes="emulator.pageSizes"
            :page-size="emulator.pageSize"
            :current-page.sync="emulator.currentPage"
            :total="emulator.total">
          </el-pagination>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props:[
    'model',
  ],
  data(){
    return {
      title:'list_'+this.model.name,
      currentParts:[
        'fields',
      ],
      parts:[
        {name:'fields',label:'Fields'},
        {name:'searchForm',label:'SearchForm'},
        {name:'pagination',label:'Pagination'},
        {name:'options',label:'Options'},
      ],

      pagination:{
        layout:['total','pager',],
        pageSizes:[10,20,50],
        pageSize: 10,
      },
      layouts:" total, sizes, prev, pager, next, jumper ".split(',').map(a=>a.trim()),

      properties:[
        {type:'selection'},
        {type:'index'},
        ...Object.entries(this.model.properties).map(([name,item])=>{return {name,...item}}),
        {type:'actions'},
        ],
      fields:[],
      searchFields:{},
      searchForm:[],
      options:{},
    };
  },
  computed:{
    canSearch(){
      return this.currentParts.includes('searchForm');
    },
    canPagination(){
      return this.currentParts.includes('pagination');
    },
    emulator(){
      return Object.assign({
        total:400,
        currentPage: 1,
      },this.pagination)
    }
  },
  methods:{
    handleSelectionChange(rows){
      this.fields=rows;
    },
    getValue(){
      // TODO sort&index
      let columnTypes={'index':'index','selection':'selection'};
      console.warn(this.fields);
      let data={fields:this.fields.map(item=>{
        return {type:columnTypes[item.type],name:item.name,label:item.label||item.description||item.type};
      })};
      data.title = this.title;
      if(this.canSearch){
        data.searchForm = this.searchForm;
      }
      if(this.canPagination){
        data.pagination = this.pagination;
      }
      return data;
    },
  },
};
</script>
<style>
</style>
