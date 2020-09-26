<template>
    <a-card :bordered="true" type="inner"  :bodyStyle="{ padding: '1px 0'}"> 
        <a-table :columns="columns" :loading="loading" :data-source="rows" :pagination="{pageSize: 50}">
            <a slot="name" slot-scope="text, item" target="_blank" :href="item.link">
                <img :src="item.album_logo" height="20" style="vertical-align: -5px; margin-right: 6px;"/>{{ text }}
            </a>
            <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        </a-table>
    </a-card>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import api from '@/api.js'

  export default {
      data() {
          return {
              columns: [
                  {
                        dataIndex: 'song_name',
                        key: 'name',
                        title: '歌曲名',
                        // slots: { title: 'customTitle' },
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        dataIndex: 'artist_name',
                        key: 'artist',
                        title: '艺人',
                        // slots: { title: 'customTitle' },
                        // scopedSlots: { customRender: 'name' },
                    },{
                        dataIndex: 'album_name',
                        key: 'album',
                        title: '专辑',
                        // slots: { title: 'customTitle' },
                        // scopedSlots: { customRender: 'name' },
                    }
              ],
              importing: false,
              importTip: null,
              loading: true,
              rows: []
          }
      },
    name: 'landing-page',
    components: { SystemInformation, ScaleLoader },
    watch: {
      $route() {
        this.loadSongs()
      }
    },
    methods: {
        async loadSongs() {
          this.importing = true
          console.log('route', this.$route.query)
          const query = this.$route.query;
          const filters = query.filters ? JSON.parse(query.filters) : {};
          const dsl = {}
          for(var k in filters) {
            dsl[k] = filters[k]
          }
          const params = {}
          if(query.filters) {
            params.dsl = {
              where: dsl
            }
          }
          this.loading = true
          const { data } = await api.get('/api/song/query', {
            params: params
          })
          this.rows = data.map(_ => {
            _.link = _.type == 'cloudmusic' ? `https://music.163.com/#/song?id=${_.song_id}` : `` 
            return _
          })
          this.loading = false
          console.log('loadSongs', data)
        },
    },
    mounted() {
        this.loadSongs()
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

  
</style>
