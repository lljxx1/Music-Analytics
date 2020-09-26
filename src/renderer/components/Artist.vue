<template>
<a-card :bordered="true" type="inner"  :bodyStyle="{ padding: '1px 0'}"> 
    <a-table :columns="columns" :loading="loading" :data-source="data" :pagination="{pageSize: 50}">
    <router-link slot="name" slot-scope="text, item" :to="item.song_url"> 
      {{ text }}
    </router-link>
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
                        dataIndex: 'artist_name',
                        key: 'name',
                        title: '艺人',
                        // slots: { title: 'customTitle' },
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        dataIndex: 'songs',
                        key: 'song',
                        title: '歌曲数',
                        // slots: { title: 'customTitle' },
                        // scopedSlots: { customRender: 'name' },
                    },{
                        dataIndex: 'albums',
                        key: 'album',
                        title: '专辑数',
                        // slots: { title: 'customTitle' },
                        // scopedSlots: { customRender: 'name' },
                    }
              ],
              loading: false,
              importing: false,
              importTip: null,
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
              rawSql: 'select count(distinct(song_name)) as songs, count(distinct(album_name)) as albums, artist_name from songs group by artist_name order by songs desc',
            //   dsl: JSON.stringify({
            //     attributes: [
            //       'artist_name'
            //     ],
            //     group: ['artist_name']
            //   })
            }
          })
          this.data = data.map(_ => {
            _.song_url = '/all?filters=' + encodeURIComponent(JSON.stringify({
              artist_name: _.artist_name
            }))
            return _;
          })
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
