var webpack = require("webpack");
var path = require('path');
var fs = require("fs");
var srcDir = "src/";
var distDir = "dist/";

function getEntry() {
  var jsPath = path.resolve(srcDir, "js");
  var dirs = fs.readdirSync(jsPath);
  var matchs = [];
  var files = {};
  dirs.forEach(function(item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      files[matchs[1]] = path.resolve(srcDir, "js", item);
    }
  });
  return files;
}
console.log(JSON.stringify(getEntry()))
module.exports = {
  devtool: "source-map",
  entry: getEntry(),
  output: {
    path: path.join(distDir, "js"),
    publicPath: "../js/",
    filename: "[name].js"
  },
  module: {
    //各种加载器，即让各种文件格式可用require引用
    loaders: [{
    //   test: /\.vue$/,
    //   loader: 'vue'
    // }, {
    //   test: /\.(png|jpg|gif)$/,
    //   loader: 'file?name=[name].[ext]?[hash]'
    // }, {
      test: /\.css$/,
      loader: 'css-loader/style-loader'
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  },
  resolve: {
    //配置别名，在项目中可缩减引用路径
    alias: {
      jQuery: srcDir + "js/lib/jquery.min",
      vue: srcDir + "js/lib/vue.min",
      commons: srcDir + "js/core/commons"
    },
    root: "./"
  },
  plugins: [
    new webpack.ProvidePlugin({
      "jQuery": "jQuery",
      "Vue": "vue"
    })
  ]
};
