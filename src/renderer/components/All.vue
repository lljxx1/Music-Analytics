<template>
    <a-card :bordered="true" type="inner"  :bodyStyle="{ padding: '1px 0'}"> 
        <div slot="title">
          <a-radio-group name="radioGroup" v-model="filters.type" :default-value="'all'">
            <a-radio value="all">
              全部
            </a-radio>
            <a-radio value="cloudmusic">
              网易云
            </a-radio>
            <a-radio value="xiami">
              虾米
            </a-radio>
          </a-radio-group>
        </div>
        <div class="operate" slot="extra">
          <a-button type="dashed" style="margin-right: 8px" @click="download" icon="download">导出</a-button>
        </div>
        <a-table :columns="columns" :loading="loading" :data-source="rows" :pagination="{pageSize: 50, showTotal: total => `全部 ${total} 结果`}">
            <a slot="name" slot-scope="text, item" target="_blank" :href="item.link">
                <img :src="item.album_logo" height="20" style="vertical-align: -5px; margin-right: 6px;"/>{{ text }}
            </a>
            <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        </a-table>
    </a-card>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import api from '@/api.js'
import moment from 'moment'

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
                        title: '艺术家',
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
              filters: {
                type: 'all'
              },
              importing: false,
              importTip: null,
              loading: true,
              rows: []
          }
      },
    name: 'landing-page',
    components: { ScaleLoader },
    watch: {
     filters: {
       handler() {
        //  console.log('a', this.filters)
          const data = JSON.parse(JSON.stringify(this.filters));
          if(data.type == "all") {
            delete data.type;
          }
          this.$router.push({
            query: {
              filters: JSON.stringify(data)
            }
          })
          console.log('a', this.filters)
          //  this.filters = JSON.stringify()
        //  this.loadSongs()
       },
       deep: true
     },
      $route() {
        this.loadSongs()
      }
    },
    methods: {
      download () {
      console.log('download')
      import('@/Export2Excel').then(excel => {
        // console.log('start', this.$refs.table.localDataSource)
        // const rowData = this.$refs.table.localDataSource
        const tHeader = ['歌曲名', '艺术家', '专辑']
        const data = []
        this.rows.forEach(row => {
          const rowItem = []
          rowItem.push(row.song_name)
          rowItem.push(row.artist_name)
          rowItem.push(row.album_name)
          data.push(rowItem)
        })

        const filename = [
          '歌单',
          moment().format('YYYY-MM-DD_hh:mm:ss')
        ].join('-')

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename + '.xlsx',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
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
            // this.filters = filters
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
          try {
            window._hmt.push(['_trackEvent', 'songs', 'all',  this.rows.length]);
          } catch (e) {}
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
