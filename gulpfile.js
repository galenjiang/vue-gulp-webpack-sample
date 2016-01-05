var gulp = require('gulp')
  // gulp工具 报错颜色
var gutil = require('gulp-util');
// 配置颜色
var colors = gutil.colors;
// 报错
var plumber = require('gulp-plumber');
// sourcemaps
var sourcemaps = require('gulp-sourcemaps')
  // 监控变动路径
var watchPath = require('gulp-watch-path')
  // 编译jade
var jade = require('gulp-jade')
  // 编译sass
var sass = require('gulp-sass')
  // 压缩css
var minifycss = require('gulp-minify-css')
  // 压缩图片
var imagemin = require('gulp-imagemin')
// 处理js
var webpack = require("webpack")
// webpack-dev-server
var WebpackDevServer = require("webpack-dev-server")
  // 编译 html
gulp.task('html', function() {
    gulp.src('src/assets/**/*.html')
      .pipe(gulp.dest('dist/assets'))
  })
  // 监控 html
gulp.task('watchhtml', function() {
    gulp.watch('src/assets/**/*.html', function(event) {
      // 路径
      var paths = watchPath(event, 'src/', 'dist/');
      // 打印变动路径
      gutil.log(colors.yellow(event.type) + ' ' + paths.srcPath);
      gutil.log(colors.green('to') + ' ' + paths.distPath);
      // src下变动文件复制到dist
      gulp.src(paths.srcPath)
          .pipe(gulp.dest(paths.distDir))
    })
  })
  // 编译jade
gulp.task('jade', function() {
    gulp.src('src/assets/**/*.jade')
      .pipe(plumber())
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('dist/assets/'))
  })
  // 监控 jade
gulp.task('watchjade', function() {
    gulp.watch('src/assets/**/*.jade', function(event, filename) {
      // 路径
      var paths = watchPath(event, 'src/', 'dist/')
        // 打印变动路径
      gutil.log(colors.yellow(event.type) + ' ' + paths.srcPath);
      gutil.log(colors.green('to') + ' ' + paths.distPath);
      // src下变动文件复制到dist
      gulp.src(paths.srcPath)
        .pipe(plumber())
        .pipe(jade({
          pretty: true
        }))
        .pipe(gulp.dest(paths.distDir))
    })
  })

  // 压缩css
gulp.task('minifycss', function() {
    gulp.src('src/css/**/*.css')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(minifycss())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css/'))
  })
  // 监控css、压缩css
gulp.task('watchcss', function() {
    gulp.watch('src/css/**/*.css', function(event) {
      // 路径
      var paths = watchPath(event, 'src/', 'dist/')
        // 打印变动路径
      gutil.log(colors.yellow(event.type) + ' ' + paths.srcPath);
      gutil.log(colors.green('to') + ' ' + paths.distPath);
      // src下变动文件复制到dist
      gulp.src(paths.srcPath)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.distDir))
    })
  })
  // 编译sass 压缩css
gulp.task('sasscss', function() {
    gulp.src('src/css/**/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(minifycss())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest('dist/css/'))
  })
  // 监控sass 压缩css
gulp.task('watchsass', function() {
    gulp.watch('src/css/**/*.scss', function(event) {
      // 路径
      var paths = watchPath(event, 'src/', 'dist/')
        // 打印变动路径
      gutil.log(colors.yellow(event.type) + ' ' + paths.srcPath);
      gutil.log(colors.green('to') + ' ' + paths.distPath);
      // src下变动文件复制到dist
      gulp.src(paths.srcPath)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.distDir))
    })
  })
  // 压缩图片
gulp.task('image', function() {
    gulp.src('src/images/**/*')
      .pipe(imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 3
      }))
      .pipe(gulp.dest('dist/images/'))
  })
  // 监控压缩图片
gulp.task('watchimage', function() {
  gulp.watch('src/images/**/*', function(event) {
    // 路径
    var paths = watchPath(event, 'src/', 'dist/')
      // 打印变动路径
    gutil.log(colors.yellow(event.type) + ' ' + paths.srcPath);
    gutil.log(colors.green('to') + ' ' + paths.distPath);
    // src下变动文件复制到dist
    gulp.src(paths.srcPath)
      .pipe(imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 3
      }))
      .pipe(gulp.dest(paths.distDir))
  })
})

// 配置webpack
var webpackConfig = require("./webpack.config.js");
gulp.task("webpack", function() {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  // myConfig.plugins = myConfig.plugins.concat();
  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
    });
});
// 监控webpack
gulp.task('watchwebpack', function() {
  gulp.watch(["src/js/**/*.js"], ["webpack"]);
})

// // dev-server配置
// gulp.task("webpack-dev-server", function(callback) {
//   // modify some webpack config options
//   var myConfig = Object.create(webpackConfig);
//   // Start a webpack-dev-server
//   new WebpackDevServer(webpack(myConfig), {
//     publicPath: "/" + myConfig.output.publicPath + 　"../",
//     stats: {
//       colors: true
//     }
//   }).listen(8080, "localhost", function(err) {
//     if (err) throw new gutil.PluginError("webpack-dev-server", err);
//     gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
//   });
// });

gulp.task('init', ['minifycss', 'sasscss', 'image', 'jade', 'html', 'webpack'])
gulp.task('default', ['watchcss', 'watchsass', 'watchimage', 'watchjade', 'watchhtml', 'watchwebpack'])
