import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import { ipcRenderer } from 'electron'
// import { ebtRenderer } from 'electron-baidu-tongji'

// const BAIDU_SITE_ID = '6cf3834b31b75f76863415637a5905f8'
// ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)

window._hmt = {
  push() {
    ipcRenderer.send('baidu-tongji', Array.from(arguments).sort(function (a, b) { return a - b; }))
  },
};


router.beforeEach((to, _, next) => {
  /* istanbul ignore else */
  if (to.path) {
    window._hmt.push(['_trackPageview', '/#' + to.fullPath])
  }
  next()
})

Vue.use(Antd);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
