const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");

// 环境变量， 决定入口是客户端还是服务端
console.log('process.env.WEBPACK_TARGET:',process.env.WEBPACK_TARGET);
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server": "client";

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = {
  css: {
    extract: false
  },
  outputDir: './dist/' + target,
  configureWebpack: () => ({
    // 将 entry 指向应用程序的server / client 文件
    entry: `./src/entry-${target}.js`,
    // 对bundle renderer 提供 source map 支持
    devtool: 'source-map',
    // 允许 webpack 以 Node 使用的方式处理动态的导入（dynamic import）
    // 并且在编译 Vue 组件时告知 `Vue-loader` 输送面向服务器代码（server-oriented code）
    target: TARGET_NODE ? "node": "web",
    node: TARGET_NODE ? undefined: false,
    output: {
      // 此处告知 server bundle 使用 Node 风格导出模块
      libraryTarget: TARGET_NODE ? "commonjs2": undefined
    },
    // 外置化应用程序依赖。 可以使服务器构建速度更快，并生成较小的 bundle 文件.
    externals: TARGET_NODE
      ? nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块
        // 可以在这里添加更多的文件类型。 例如： 未处理 *.vue 原始文件
        // 你还应该讲改为 `global` （例如 polyfill）的依赖模块列入白名单
        allowlist: [/\.css$/]
      })
      : undefined,
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined
    },
    // 将服务器的整个输出构建为单个 JSON 文件的插件。
    // 服务端默认文件名为 `vue-ssr-server-bundle.json`
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  }),
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        });
      });
  }
};