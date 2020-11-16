// nodejs 服务器

const express = require('express');
const fs = require('fs');

// 创建express 和 vue 的实例
const app = express();

// 创建渲染器
const {createBundleRenderer} = require('vue-server-renderer');
const serverBundle = require('../dist/server/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json');
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: fs.readFileSync('../public/index.temp.html', 'utf-8'),  // 需要一个宿主的文件
  clientManifest
});

// 中间件处理静态文件的请求
app.use(express.static('../dist/client', {index: false}));

// 将路由的处理全给vue

app.get('*', async (req, res) => {

  try {
    const context = {
      url: req.url,
      title: 'ssr test',
    }
    const html = await renderer.renderToString(context);
    res.send(html);
    
  } catch (error) {
    res.status(500).send('error')
  }
  
});

app.listen(8000, () => {
  console.log('render the page complated');
})