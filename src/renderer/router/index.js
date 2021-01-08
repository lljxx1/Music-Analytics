import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/downloader",
      name: "downloader",
      component: require("@/components/Downloader").default,
    },
    {
      path: "/all",
      name: "All",
      component: require("@/components/All").default,
    },
    {
      path: "/artists",
      name: "artists",
      component: require("@/components/Artist").default,
    },
    {
      path: "/album",
      name: "artists",
      component: require("@/components/Album").default,
    },
    {
      path: "/",
      name: "Intro",
      component: require("@/components/Intro").default,
    },
    {
      path: "/about",
      name: "About",
      component: require("@/components/About").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
