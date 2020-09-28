<template>
  <div id="ww">
    <a-card title="检测到歌单" :bordered="true" v-if="sources.length != 0 && !importing"> 
        <a-list item-layout="horizontal" :data-source="sources">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <span slot="title"> {{ item.name }} </span>
              <img
                slot="avatar"
                src="~@/assets/163.png"  v-if="item.type == 'cloudmusic'"
                height="22"
              />
              <img
                slot="avatar"
                src="~@/assets/xiami.png" v-if="item.type == 'xiami'"
                height="22"
              />
            </a-list-item-meta>
          </a-list-item>
          <div style="border-top: 1px solid #eee; padding-top: 20px">
              <scale-loader class="loading" :loading="true" color="black" ></scale-loader>
              准备导入歌单..
          </div>
        </a-list>
    </a-card>
    <a-card title="导入歌单" :bordered="true" v-if="importing"> 
        <scale-loader class="loading" :loading="importing" color="black" ></scale-loader>
        <div v-html="importTip" style="padding-top: 25px; text-align: center"></div>
    </a-card>
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <a-card title="扫描数据" v-if="sources.length == 0" :bordered="true" > 
        <scale-loader class="loading" :loading="loading" color="black" ></scale-loader>
        <span v-if="!loading">
          <p>没有找到歌单数据!!!<br><br>请确保软件版本大于以下：<br></p>
          <h4>Windows</h4>
          <ul>
            <li>虾米音乐 7.2.8</li>
            <li>网易云音乐 2.7.0 (Build: 198230)</li>
          </ul>
          <h4>Mac</h4>
          <ul>
            <li>网易云音乐 2.3.2 (Build: 832</li>
          </ul>
          <p>问题反馈: <a href="https://support.qq.com/products/284751">https://support.qq.com/products/284751</a>，或 联系作者: <a href="https://www.douban.com/people/52076105/" target="_blank">fun</a></p>
        </span>
    </a-card>
  </div>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import api from '@/api.js'
  export default {
      data() {
          return {
              loading: true,
              importing: false,
              importTip: null,
              sources: []
          }
      },
    name: 'landing-page',
    components: { ScaleLoader },
    methods: {
        async importSongs() {
          this.importing = true
          for (let index = 0; index < this.sources.length; index++) {
            const source = this.sources[index];
            this.importTip = '正在导入 '+ source.name
            const { data } = await api.get('/api/import', {
              params: {
                type: source.type
              }
            })
            this.importTip = data.error ? `${source.name} <br><span style="color: red">${data.msg}</span>`: `${source.name}<br> 导入完成 发现${data.state.totalSong}首，已导入${data.state.imported}首`;
            await new Promise((resolve, reject) => {
              setTimeout(resolve, 3 * 1000)
            })
          }
          this.$router.push('/all')
        },
        async findSources() {
            const { data } = await api.get('/api/find/source')
            this.loading = false
            if(data.length) {
              const logos = {
                'cloudmusic': '~@/assets/163.png',
                'xiami': '~@/assets/xiami.png',
              }
              this.sources = data.map(_ => {
                _.logo = logos[_.type]
                return _
              })
              setTimeout(() => {
                this.importSongs()
              }, 2 * 1000)
            }
            try {
              window._hmt.push(['_trackEvent', 'source', 'find', data.length]);
            } catch (e) {}
            console.log('findSources', data)
        },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    mounted() {
      this.findSources()
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
    /* text-align: center; */
  }

  
</style>
