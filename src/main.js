import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from './components/common/toast'
import FastClick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false
//解决移动端300ms延时的问题
FastClick.attach(document.body)
//添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)
//使用图片懒加载插件
Vue.use(vueLazyLoad,{
  loading: require('./assets/img/common/1.jpg')
})
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')




