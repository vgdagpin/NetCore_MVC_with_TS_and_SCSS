1. Right click project
1. Open in Terminal
1. npm install gulp gulp-typescript gulp-sourcemaps gulp-csso gulp-uglify gulp-rename gulp-concat gulp-replace --save-dev
1. npm install webpack webpack-cli webpack-stream --save-dev
1. npm install node-sass --save-dev
1. npm install @progress/kendo-theme-material --save
1. add wwwroot/scss/_variables.scss
```
$bodyFontSize: 1rem;
$bodyFontFamily: 'Roboto', sans-serif;
```
1. add wwwroot/scss/kendo.scss
```
@import "./_variables.scss";

@import "node_modules/@progress/kendo-theme-default/dist/all.scss";

@import "./kendo.grid.scss";
@import "./kendo.panelbar.scss";
```
1. add wwwroot/scss/site.scss
1. add wwwroot/ts/modules/_tsconfig.json
```
{
  "compilerOptions": {
    "module": "es6", // Set module to "es6"
    "noImplicitAny": false,
    "target": "es6",
    "sourceMap": true
  },
  "include": [
    "module1.ts"
  ]
}
```
1. add wwwroot/ts/modules/module1.ts
1. add wwwroot/ts/site.ts
1. add gulpfile.js