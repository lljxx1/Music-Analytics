<template>
<a-card :bordered="true" type="inner"  :bodyStyle="{ padding: '1px 0'}"> 
  <div style="padding: 15px">
  </div>
  <div style="text-align: center; padding-top: 30px;" class="about-page">
    <a href="https://music.wechatsync.com/?utm_source=about" target="_blank"><img src="~@/assets/logo.png" height="60"> <br> 
    <p style="font-size: 22px; color: rgb(34, 34, 34);">歌单助手</p></a> 
    <div style="color: rgb(119, 119, 119); margin-top: 50px; margin-bottom: 40px">
        <p>作者: <a href="https://www.douban.com/people/52076105/" target="_blank">fun</a></p>
        <p>版本：0.0.4</p> 
        <p>Github: <a href="https://github.com/lljxx1/Music-Analytics" target="_blank">lljxx1/Music-Analytics</a></p>
        <p>问题反馈:<a href="https://support.qq.com/products/284751" target="_blank">https://support.qq.com/products/284751</a></p>
    </div>
    <p><span>&nbsp;</span><img src="https://txc.gtimg.com/data/105772/2020/1206/9d88d68c1d7d22dfb442989d3133ca41.png" width="400" alt="9d88d68c1d7d22dfb442989d3133ca41.png"></p>
    <p style="margin-bottom: 30px"><span style="color:#111;">关注公众号以便接收【新功能】的通知</span></p>
</div>
  </a-card>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import api from '@/api.js'
  export default {
      data() {
          return {
              data: []
          }
      },
    name: 'landing-page',
    components: { ScaleLoader },
    watch: {
  
    },
    methods: {
       
    },
    mounted() {
    },
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    height: 100vh;
    /* padding: 60px 80px; */
    width: 100vw;
    text-align: center;
  }

  .about-page p {
      margin-bottom: 5px;
  }

</style>
