import gulp from 'gulp'
import babel from 'gulp-babel'
import path from 'path'
import plumber from 'gulp-plumber'
import replace from 'gulp-replace'



// 如下是把es6App转为app下es5的写法
let folderName = process.argv[2]
let taskName = folderName
let fileName = '*'

const from = path.join(__dirname, 'src/es6App')
const to = path.join(__dirname, 'src/app')

let src = path.join(from, folderName, './**/' + fileName + '.js')
let dist = path.join(to, folderName)

gulp.task('build', function() {
    return gulp.src(src)
        .pipe(plumber())
        .pipe(babel({
            "presets": ["env"]
        }))
        .pipe(replace(/"use strict";/, ''))
        .pipe(gulp.dest(dist))
})
gulp.task(taskName, ['build'], function() {
    var watcher = gulp.watch(src, ['build'])
    console.log(src)
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    })
})
 
gulp.task('default', function() {
    console.error('请输出一个目录名: gulp floderName')
})
 