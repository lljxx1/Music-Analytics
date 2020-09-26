<template>
  <div id="app">
     <!-- <router-view></router-view> -->
    <a-layout id="components-layout-demo-custom-trigger" :style="{'min-height': '100vh'}">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <!-- <div class="logo" /> -->
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" style="margin-top:0">
          <router-link  :to="'/all'">
            <a-icon type="heart" />
            <span>所有收藏</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" :to="'/artists'">
          <router-link  :to="'/artists'">
            <a-icon type="user" />
            <span>艺人</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link  :to="'/album'">
            <a-icon type="profile" />
            <span>专辑</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
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
  export default {
    name: 'music-exporter'
  }
</script>

<style>

 body {
    min-height: 100vh;
    /* padding: 60px 80px; */
    /* width: 100vw; */
    /* text-align: center; */
  }
  /* CSS */
</style>
