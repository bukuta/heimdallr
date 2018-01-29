<template>
  <div class="piece-generation-detail">
    <el-row>
      <el-col :span="12">
        配置
      </el-col>
      <el-col :span="12">
        Emulator
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-row>
            Fields
          </el-row>
          <el-row :span="18">
            <el-table
              :data="detail.fields"
              >
              <el-table-column
                type="index"
                >
              </el-table-column>

              <el-table-column
                label="type"
                width="180"
                >
                <template scope="scope">
                  <span>{{scope.row.type||'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="name"
                >
                <template scope="scope">
                  <span>{{scope.row.name||'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="label"
                >
                <template scope="scope">
                  <span>{{scope.row.label||(!scope.row.type&&detail.model.properties[scope.row.name].description)||scope.row.type}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
        <el-row v-if="detail.searchForm" >
          <el-row :span="6">
            SearchForm
          </el-row>
          <el-row :span="18">
            <el-table
              :data="detail.searchForm"
              >
              <el-table-column
                type="index"
                >
              </el-table-column>

              <el-table-column
                prop="label"
                label="label"
                >
              </el-table-column>
              <el-table-column
                prop="name"
                label="name"
                >
              </el-table-column>
              <el-table-column
                prop="type"
                label="type"
                >
              </el-table-column>
              <el-table-column
                prop="placeholder"
                label="placeholder"
                >
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
        <el-row v-if="detail.pagination" >
          <el-row :span="6">
            Pagination
          </el-row>
          <el-row style="margin-bottom: 20px;">
              {{detail.pagination.layout}} :{{detail.pagination.pageSizes}}/{{detail.pagination.pageSize}}
          </el-row>
        </el-row>
        <el-row v-if="detail.options" >
          <el-row :span="6">
            Options
          </el-row>
          <el-row :span="18">
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row style="padding: 20px 0 0 20px;">
          <el-col>
            <el-table
              :data="emulatorItems"
              >
              <el-table-column
                v-for="item of detail.fields"
                :type="item.type"
                :prop="item.name"
                :label="item.label||item.name"
                :key="item.type+item.name+item.label"
                >
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row v-if="detail.pagination">
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
    'detail',
  ],
  data(){
    console.warn('this.detail',this.detail);
    return {};
  },
  computed:{
    emulatorItems(){
      let item = _.fromPairs(this.detail.fields.filter(item=>item.name).map(item=>{
      return [item.name,item.name];
      }));
      console.warn('item',item);
      return [item,item,item];
    },
    emulator(){
      return Object.assign({
        layout:[],
        total:400,
        currentPage: 1,
      },this.detail.pagination)
    }
  },
};
</script>
<style lang="less">
.piece-geration-detail{
  .el-row{
    margin-bottom: 10px;
  }
}
</style>
