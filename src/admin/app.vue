<template>
  <el-row id="app" v-bind:class="['app','app-'+(isAuthorize?'normal':'auth')]" type='flex' justify='space-between'>
    <nav class="top-nav" key="normal" v-if="isAuthorize">
      <div class="navbar-brand">
        <span>Heimdallr</span>
      </div>
      <b-menu :router="true" ref="navmenu" :default-active="activeIndex" class="nav-menu" mode="horizontal"
        @select="handleSelect">
        <el-menu-item index="/home">Home</el-menu-item>
        <el-submenu index="/specs">
          <template slot="title">Api Specs</template>
          <el-menu-item index="/apis/responses">Response Template</el-menu-item>
        </el-submenu>
        <el-submenu index="/apis">
          <template slot="title">Apis</template>
          <el-menu-item index="/apis/list">Api list</el-menu-item>
          <el-menu-item index="/apis/tags">Tags</el-menu-item>
          <el-menu-item index="/apis/entities">Entities</el-menu-item>
        </el-submenu>
        <el-menu-item index="/generations">Generations</el-menu-item>
        <el-submenu index="/test">
          <template slot="title">Test</template>
          <el-menu-item index="/test/cases">Cases</el-menu-item>
          <el-menu-item index="/test/schedule">Arrange&Organize</el-menu-item>
        </el-submenu>
        <el-menu-item index="/logs">Logs</el-menu-item>
        <el-menu-item index="/configs">Global Settings</el-menu-item>
      </b-menu>
    </nav>
    <el-row class="main-wrapper">
      <router-view ref="routerView">
      </router-view>
    </el-row>
    <footer class="footer" style="text-align: center; padding: 32px 0;">
      ©  2018  bukuta.tech
    </footer>
  </el-row>
</template>

<script>
  import router from './router'
  import * as types from './const/mutationTypes'
  import { Menu } from 'element-ui'
  import {mapGetters} from 'vuex';

  export default {
    name: 'app',

    props:{ },
    components: {
      'b-menu': {
        name: Menu.name,
        mixins: [Menu],
        methods: {
          getNearestIndex (path) {
            let index = path
            let activeItem = this.items[index]
            if (activeItem) return path

            while (!activeItem) {
              if (index.lastIndexOf('/') < 0) return path
              index = index.slice(0, index.lastIndexOf('/'))
              activeItem = this.items[index]
            }
            return index
          }
        }
      }
    },

    data () {
      return {
        activeIndex: '1',
        curUrl: window.location.pathname || ''
      }
    },
    created () {
    },
    mounted () {
      //  @TODO 激发此动作必须检查用户登录态
      this.prefetchData()
      console.log('$router.',this.$router);
      this.$nextTick(()=>{
        console.log('this.refs.navmenu',this.$refs.navmenu);
        if(this.$refs.navmenu){
          this.activeIndex = this.$refs.navmenu.getNearestIndex(this.$route.path);
        }
      });
    },
    beforeRouteEnter(to, from, next){
      console.log('beforeRouteEnter');
    },
    beforeRouteUpdate (to, from, next) {
      console.log('beforeRouteUpdate',to,from,next);
    },
    computed:{
      ...mapGetters(['isAuthorize']),
    },
    methods: {
      prefetchData () {
        // 数据预取
        this.$store.dispatch('initdata');
      },
      handleSelect (key, keypath) {
        // console.log('before navigation',key,keypath);
        this.activeIndex = key
      },
      click (params) {
        console.log('组件里面触发啦', params)
        this.$router.push({path: params.url})
      }
    },
    watch:{
      'isAuthorize':function(value){
        console.warn('isAuthorize.change',value);
        if(value=='login'){
        //  this.$router.push('/contacts/');
        }else if(value=='logout'){
          this.$router.push('/login/');
        }
      },
    },
  }
</script>

<style>
  @import "./styles/index.less";

  [class^="el-icon-fa"], [class*=" el-icon-fa"] {
    display: inline-block;
    font-family: FontAwesome !important;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app {
    position: relative;
    width: 100%;
    height: 100%;
    flex-direction: column;
    & .top-nav {
      border-top: 3px solid rgba(0, 157, 218, 1);
      color: rgb(60, 87, 141);
      display: flex;
      background: #fff;
      & .nav-menu {
        flex: 1;
        background: #fff;
      }
    }

    & .navbar-brand {
      line-height: 60px;
      height: 60px;
      padding-right: 10px;
      margin-left: 40px;
      font-weight: 200;
      font-size: 28px;
      & span {
        font-weight: 700;
        font-size: 28px;
        display: inline-block;
        vertical-align: top;
      }
    }

    & .main-wrapper {
      flex: 1;
      margin: 20px;
      padding: 20px;
      background: #fff;
      overflow: hidden;
    }
  }
</style>
