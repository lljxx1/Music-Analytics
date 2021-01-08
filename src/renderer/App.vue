<template>
  <div id="app">
     <!-- <router-view></router-view> -->
    <a-layout id="components-layout-demo-custom-trigger" :style="{'min-height': '100vh'}">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible :style="{background: 'white'}"> 
      <!-- <div class="logo" /> -->
      <a-menu theme="light" mode="inline" :selectedKeys="selectedKeys">
        <a-menu-item key="/explore">
          <a @click="goExp">
            <a-icon type="bulb" />
            <span>发现音乐</span>
          </a>
        </a-menu-item>
        <a-menu-item key="/all" style="margin-top:0">
          <router-link  :to="'/all'">
            <a-icon type="heart" />
            <span>所有收藏</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="/artists" >
          <router-link :to="'/artists'">
            <a-icon type="user" />
            <span>艺术家</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="/album">

          <router-link :to="'/album'">
            <a-icon type="profile" />
            <span>专辑</span>
          </router-link>
        </a-menu-item>
          <a-menu-item key="/downloader">
          <router-link :to="'/downloader'">
            <a-icon type="download" />
            <span>批量下载</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="/">
          <router-link :to="'/'">
            <a-icon type="search" />
            <span>导入</span>
          </router-link>
        </a-menu-item>
       
        <!-- https://music.wechatsync.com/explore -->
        <a-menu-item key="/about">
          <router-link  :to="'/about'">
            <a-icon type="info-circle" />
            <span>关于</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout style="height:100vh; overflow-y:scroll">
      <a-layout-content
        :style="{ margin: '24px 16px', minHeight: '280px' }"
      >
        <a-row>
          <router-view></router-view>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
    
  </div>
</template>

<script>

import api from '@/api.js'
  export default {
    name: 'music-exporter',
    data() {
      return {
        selectedKeys: [this.$route.path]
      }
    },
    watch: {
      $route() {
        this.selectedKeys = [this.$route.path]
      }
    },
    methods : {
      async goExp() {
        const { data } = await api.get('/api/tabs/create', {
          params: {
            url: 'https://music.wechatsync.com/explore/?utm_source=desktop',
            // url: 'http://localhost:8080',
            width: 1340,
            height: 900
          }
        })
      }
    }
  }
</script>

<style>

/* 设置滚动条的样式 */
::-webkit-scrollbar {
width:8px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
border-radius:10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
border-radius:10px;
background:rgba(0,0,0,0.1);
-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
background:#ccc;
}

 body {
    min-height: 100vh;
    /* padding: 60px 80px; */
    /* width: 100vw; */
    /* text-align: center; */
  }
  /* CSS */

  #app .ant-table-pagination.ant-pagination {
    margin-right: 20px;
  }
</style>
