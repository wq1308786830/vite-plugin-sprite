# vite-plugin-sprite
vite-plugin-sprite 是一个基于nodejs生成雪碧图的vite插件，可以将指定任意文件夹下的图文件合并为一张图，并输出最终图文件以及css定位文件方便使用。

支持的格式：`['.png', '.jpg', '.jpeg', '.gif']`

需要注意的是，gif虽然支持，但是由于合并图片只能是静态图，所以只会取gif第一帧作为合并源。

使用：
```js
import vitePluginSprite from 'vite-plugin-sprite'

...

export default defineConfig(({ command, mode }) => {
  return {
    // ...
    plugins: [
      // ...
      vitePluginSprite({ source: '**/sprite' })
    ]
  }
})
```

入参:
```js
source // 支持指定任意目录包括递归目录，如： sprite, ./sprite, **/sprite， test/**/sprite等合法路径。
scale // css像素数值的缩放倍数，方便在css中使用。
```
