import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import App from "./components/App";
import store from "./store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  el: "#app",
  store,
  components: { App },
  template: "<app/>",
});
