// 创建Vue 实例
import Vue from 'vue';
import App from './App.vue';
import createRouter from './router';

export default function createApp() {
  const router = createRouter();
  const app = new Vue({
    router,
    render: h => h(App)
  });
  return {app, router}
}

// 服务器端不需要挂载