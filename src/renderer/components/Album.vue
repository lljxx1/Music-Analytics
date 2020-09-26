<template>
<a-card :bordered="true" type="inner"  :bodyStyle="{ padding: '1px 0'}"> 
    <a-table :columns="columns" :loading="loading" :data-source="data" :pagination="{pageSize: 50}">
    <a slot="name" slot-scope="text, item">
        <img :src="item.album_logo"  height="100" style="vertical-align: middle; margin-right: 10px;"/>{{ text }}
    </a>
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
                        dataIndex: 'album_name',
                        key: 'album',
                        title: '专辑',
                        scopedSlots: { customRender: 'name' },
                        // slots: { title: 'customTitle' },
                        // scopedSlots: { customRender: 'name' },
                    },
                  {
                        dataIndex: 'artist_name',
                        key: 'name',
                        title: '艺人',
                        // slots: { title: 'customTitle' },
                    },
                    {
                        dataIndex: 'songs',
                        key: 'song',
                        title: '歌曲数',
                        // slots: { title: 'customTitle' },
                        // scopedSlots: { customRender: 'name' },
                    }
              ],
              importing: false,
              importTip: null,
              loading: true,
              data: []
          }
      },
    name: 'landing-page',
    components: { SystemInformation, ScaleLoader },
    methods: {
        async loadData() {
          this.importing = true
          this.loading = true
          const { data } = await api.get('/api/song/query', {
            params: {
              rawSql: 'select count(distinct(song_name)) as songs, album_name, artist_name, album_logo from songs group by album_name, artist_name  order by songs desc',
            //   dsl: JSON.stringify({
            //     attributes: [
            //       'artist_name'
            //     ],
            //     group: ['artist_name']
            //   })
            }
          })
          this.data = data
          this.loading = false
          console.log('loadData', data)
        },
    },
    mounted() {
        this.loadData()
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
