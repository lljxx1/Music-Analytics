<template>
<a-card :bordered="true" type="inner"  :bodyStyle="{ padding: '1px 0'}"> 
    <div style="padding: 15px">
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
    <a-table :columns="columns" :loading="loading" :data-source="data" :pagination="{pageSize: 50, showTotal: total => `全部 ${total} 结果`}">
    <!-- <a slot="name" slot-scope="text, item">
        <img :src="item.album_logo"  height="100" style="vertical-align: middle; margin-right: 10px;"/>{{ text }}
    </a> -->
    <router-link slot="name" slot-scope="text, item" :to="item.song_url"> 
      <img :src="item.album_logo"  height="100" style="vertical-align: middle; margin-right: 10px;"/>{{ text }}
    </router-link>
  </a-table>
  </a-card>
</template>

<script>
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
              filters: {},
              importing: false,
              importTip: null,
              loading: true,
              data: []
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
       },
       deep: true
      },
      $route() {
        this.loadData()
      }
    },
    methods: {
        async loadData() {
          this.importing = true
          this.loading = true
          const query = this.$route.query;
          const filters = query.filters ? JSON.parse(query.filters) : {};
          // const dsl = {}
          let filtersql = 'WHERE '
          for(var k in filters) {
            // dsl[k] = filters[k]
            filtersql += ` ${k} = "${filters[k]}"`
          }
          let hasFilters = Object.keys(filters).length > 0
          let filterQuery = hasFilters ? filtersql : ''
          console.log('filtersql', filtersql)
          const { data } = await api.get('/api/song/query', {
            params: {
              rawSql: 'select count(distinct(song_name)) as songs, album_name, artist_name, album_logo from songs '+ filterQuery +' group by album_name, artist_name  order by songs desc',
            }
          })
          this.data = data.map(_ => {
            _.song_url = '/all?filters=' + encodeURIComponent(JSON.stringify({
              album_name: _.album_name
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
