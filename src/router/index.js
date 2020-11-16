import Vue from 'vue';
import Router from 'vue-router';

import Index  from '@/components/Index';
import Detail  from '@/components/Detail';

Vue.use(Router);

// 次数为什么不导出一个router的实例？

// 将来每次用户请求都需要创建router实例

export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {path: '/', component: Index},
      {path: '/detail', component: Detail},
    ]
  })
}