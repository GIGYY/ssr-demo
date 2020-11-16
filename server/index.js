// nodejs 服务器

const express = require('express');
const Vue = require('vue');

// 创建express 和 vue 的实例
const app = express();

// 创建渲染器
const renderer = require('vue-server-renderer').createRenderer();

// 就用渲染器渲染page可以得到html的内兄
const page = new Vue({
  data: {title: 'this is title'},
  template: '<div>hello ssr demo</div>'
});

app.get('/', async (req, res) => {

  try {
    const html = await renderer.renderToString(page); // 异步的方法
    console.log(html);
    // 因为本来就是html的字符串， send会自动去把响应头给加上
    res.send(html);
  } catch (error) {
    res.status(500).send('error')
  }
  
});

app.listen(8000, () => {
  console.log('服务器渲染成功');
})