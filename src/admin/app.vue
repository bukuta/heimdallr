<template>
  <el-row id="app" v-bind:class="['app']" type='flex' justify='space-between'>
    <nav class="top-nav" key="normal" >
      <div class="navbar-brand">
        <span>Alodi</span>
      </div>
      <b-menu
        v-if="spec"
        :router="true"
        ref="navmenu"
        :default-active="activeIndex"
        class="nav-menu"
        mode="horizontal"
        >
        <el-menu-item index="/home">Home</el-menu-item>
        <el-submenu index="/apis">
          <template slot="title">Apis</template>
          <el-menu-item index="/apis/list">Api list</el-menu-item>
          <el-menu-item index="/apis/tags">Tags</el-menu-item>
          <el-menu-item index="/apis/entities">Entities</el-menu-item>
        </el-submenu>
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
  import { Menu } from 'element-ui'
  import {mapState} from 'vuex';


  export default {
    name: 'app',

    props:{ },
    components: {
      'b-menu': {
        name: Menu.name,
        mixins: [Menu],
        watch:{
          '$route':function($r){
            console.log('watch.$route',$r);
          },
        },
        methods: {
          getNearestIndex (path) {
            console.log('getNearestIndex',path);
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
        curUrl: window.location.pathname || ''
      }
    },
    created () {
    },
    mounted () {
      let path = this.$router.currentRoute.path;
      console.log('$router',this.$router);
      console.log('activeIndex',path);
      this.fetchApi();
    },
    computed:{
      ...mapState({
        spec: state=>state.specStore.spec,
      }),
      activeIndex: function(){
        let path = this.$router.currentRoute.path;
        return path;
      },
    },
    methods: {
      fetchApi(){
        this.$store.dispatch('specStore/fetchApi');
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
