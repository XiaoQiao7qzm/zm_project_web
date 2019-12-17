import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './assets/js/config'
// reset默认样式
import './assets/css/reset.scss'

// view-design全局样式
import 'view-design/dist/styles/iview.css'
import {
  Button, 
  Input, 
  Icon, 
  Form, 
  FormItem, 
  Alert, 
  Layout, 
  Header,
  Menu,
  MenuItem,
  Sider,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Content,
  Table,
  Page,
  Upload,
  Card
} from "view-design";
Vue.component("Button", Button)
Vue.component("Input", Input)
Vue.component("Icon", Icon)
Vue.component("Form", Form)
Vue.component("FormItem", FormItem)
Vue.component("Alert", Alert)
Vue.component("Layout", Layout)
Vue.component("Header", Header)
Vue.component("Menu", Menu)
Vue.component("MenuItem", MenuItem)
Vue.component("Sider", Sider)
Vue.component("Submenu", Submenu)
Vue.component("Submenu", Submenu)
Vue.component("Breadcrumb", Breadcrumb)
Vue.component("BreadcrumbItem", BreadcrumbItem)
Vue.component("Content", Content)
Vue.component("Table", Table)
Vue.component("Page", Page)
Vue.component("Upload", Upload)
Vue.component("Card", Card)





Vue.config.productionTip = false
Vue.prototype.$req_url = config.req_url

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
