<template>
  <div class="page-home" v-loading="!spec">
    <div v-if="spec">
      <el-row>
        <el-col>
          <h1>{{spec.info.title}}<span style="margin: 0 10px;  color: #ccc;">v{{spec.info.version}}</span></h1>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          spec: OpenAPI-{{spec.openapi}}
        </el-col>
      </el-row>
      <el-row style="border-left: 2px solid #aaa; padding: 20px;">
        <el-col style="color:#aaa;">
          {{spec.info.description}}
        </el-col>
      </el-row>
      <el-row style="padding: 20px;">
        <el-col style="">
          Simple Statistics
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <router-link :to="{name:'apiList'}" class="router-link">
            <div class="statistics-item">
              <div class="count">{{paths.total}}</div>
              <div class="title">Apis</div>
            </div>
          </router-link>
          <router-link :to="{name:'entities'}" class="router-link">
            <div class="statistics-item">
              <div class="count"> {{entities.length}} </div>
              <div class="title">Entities</div>
            </div>
          </router-link>
          <router-link :to="{name:'tags'}" class="router-link">
            <div class="statistics-item">
              <div class="count"> {{tagsCount}} </div>
              <div class="title">Tags</div>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {mapState,mapGetters} from 'vuex';

export default {
  name: 'Home',
  components: {
  },
  created() {
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
    ...mapState({
      spec: state=>state.specStore.spec,
    }),
    ...mapGetters('specStore',{
      paths:'paths',
      tags:'tags',
      entities:'entities',
    }),
    tagsCount:function(){
      return Object.values(this.tags).length;
    },
  },
  watch: {
  }
}
</script>

<style lang="less">
.page-home{
  .el-row{
    margin-bottom: 20px;
  }
  .router-link{
    margin-right: 20px;
    .statistics-item{
      width: 200px;
      display: inline-block;
      height: 120px;
      text-align: center;
      border-right: 1px solid #ddd;
      .count{
        font-size: 30px;
        line-height: 100px;
      }
      .title{
        font-size: 12px;
      }
    }
    &:last-child {
      margin-right: 0;
      .statistics-item{
        border-right: none;
      }
    }
  }
  .statistics-item{

  }
}
</style>
