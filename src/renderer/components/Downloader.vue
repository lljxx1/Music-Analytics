<template>
  <div id="ww">
    <a-card title="批量下载" :bordered="true" v-if="!downloading"> 
        <a-list item-layout="horizontal" :data-source="sources">
        <p>{{ totalTask }}首</p>
         <a-input v-model="saveDir" placeholder="存储文件夹" />
          <!-- <div style="border-top: 1px solid #eee; padding-top: 20px">
              <scale-loader class="loading" :loading="true" color="black" ></scale-loader>
              准备导入歌单..
          </div> -->
          <div style="padding-top: 20px;
    border-top: 1px solid #eee; font-size: 12px">
            <!-- <a-button type="dashed" @click="findSources" size="large" style="width: 140px; " icon="reload">重新扫描</a-button> -->
            <a-button type="primary" @click="startDownload" size="large" style="width: 140px;" icon="download">开始下载</a-button>
          </div>
        </a-list>
    </a-card>
    <a-card title="下载中" :bordered="true" v-if="downloading"> 

         <a-row :gutter="16">
                <a-col :span="8">
                  <a-statistic title="速度" :value="currentStatus.status.currentSpeed" style="margin-right: 50px">
                  </a-statistic>
                </a-col>
                <a-col :span="8">
                  <a-statistic title="完成" :value="currentStatus.status.doneTasks.length" class="demo-class">
                  </a-statistic>
                </a-col>
                <a-col :span="8">
                  <a-statistic title="剩余" :value="currentStatus.status.undone " class="demo-class"> </a-statistic>
                </a-col>
              </a-row>


<div style="
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 20px;
">
    <h3>最新下载</h3>
     <a-list item-layout="horizontal" :data-source="recentTasks">
          <a-list-item slot="renderItem" slot-scope="item">
               <a-list-item-meta :description="item.artist_name">
                        <a slot="title" target="_blank">{{ item.song_name }}</a>
                        <img
                            slot="avatar"
                            :src="item.album_logo"
                            height="55"
                        />
                </a-list-item-meta>
          </a-list-item>
     </a-list>
</div>
              <!-- recentTask -->
        <!-- <p>{{ totalTask }}首</p>
        <p>已完成{{ currentStatus.status.doneTasks.length }}首</p>
        <p>剩余{{ currentStatus.status.undone }}首</p> -->
    </a-card>
  </div>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import api from '@/api.js'
  export default {
      data() {
          return {
              debugInfo: [],
              loading: true,
              importing: false,
              importTip: null,
              saveDir: null,
              recentTasks: [],
              currentStatus: null,
              downloading: false,
              totalTask: 0,
              timer: null,
              sources: []
          }
      },
    name: 'landing-page',
    components: { ScaleLoader },
    watch: {
        saveDir() {
            window.localStorage.setItem('saveDir', this.saveDir)
        }
    },
    methods: {
        async createTask() {
            const { data } = await api.get('/downloader/create', {
            })
            this.totalTask = data.task.length;
            return data;
        },
        async startDownload() {
            if(!this.saveDir) {
                this.$info({
                    message: '不能为空'
                });
                return;
            }
           const { data } = await api.get('/downloader/start', {
               params: {
                   saveDir: this.saveDir
               }
            })
            this.downloading = true;
            this.timer = setInterval(() => {
                this.loadStatus();
            }, 1000);
        },

        async loadStatus() {
             const { data } = await api.get('/downloader/status')
             this.currentStatus = data;
             this.recentTasks = data.status.doneTasks.reverse().slice(0, 50)
        },
      
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    mounted() {
        this.saveDir = window.localStorage.getItem('saveDir')
    //   this.findSources()
        if(this.saveDir) {
            this.startDownload();
        } else {
            this.createTask()
        }
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
