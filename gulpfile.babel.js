// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import handlebars from 'handlebars';
import gulpHandlebars from 'gulp-compile-handlebars';
import del from 'del';
import gulpRename from 'gulp-rename';


const reload = browserSync.reload;
const $ = gulpLoadPlugins();


//BrowserSync
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: ['dist', 'src']
    },
  });
})

// Remove existing docs and dist build
gulp.task('clean', del.bind(null, ['docs/dist', 'dist']));

//Handlebars
gulp.task('handlebars', function () {
    var templateData = {
        firstName: 'Test'
    },
    options = {
        ignorePartials: false, 
        batch : ['templates/layouts']
    }
 
    return gulp.src('templates/layouts/header.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename('header.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['handlebars']);


// Build LibSass files
gulp.task('styles', function() {
  gulp.src('src/scss/discovery.scss')
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write('.'))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest('dist/css'));
});



// Build JavaScript files
gulp.task('scripts', function() {
  return gulp.src(['assets/bootstrap/dev/js/src/util.js', 'assets/bootstrap/dev/js/src/alert.js', 'assets/bootstrap/dev/js/src/button.js', 'assets/bootstrap/dev/js/src/carousel.js', 'assets/bootstrap/dev/js/src/collapse.js', 'assets/bootstrap/dev/js/src/dropdown.js', 'assets/bootstrap/dev/js/src/modal.js', 'assets/bootstrap/dev/js/src/scrollspy.js', 'assets/bootstrap/dev/js/src/tab.js', 'assets/bootstrap/dev/js/src/tooltip.js', 'assets/bootstrap/dev/js/src/popover.js'])
    .pipe($.babel())
    .pipe($.concat('./bootstrap.js'))
    .pipe(gulp.dest('dist/js'));
});


// Watch tasks
gulp.task('watch', function() {
       gulp.watch('scss/*.scss', ['styles']);
       gulp.watch('js/src/*.js', ['scripts']);
       gulp.watch("src/*.html").on('change', browserSync.reload), ['browser-sync'];
});

gulp.task('dist', ['styles', 'scripts','browser-sync','handlebars']);

gulp.task('default', ['clean'], () => {
  gulp.start('dist');
});

