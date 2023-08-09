# vue_worker-loader

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
### 预览

see[预览](https://1t1824d.github.io/vue-worker_loader_preview/#/).

### Vue中使用WebWorker

See [Vue中使用WebWorker](https://blog.csdn.net/weixin_44240581/article/details/129186915).

#### 安装loader

```
npm install worker-loader -D
如果直接把worker.js放到public目录下，则不需要安装loader
```

#### vue.config.js

```
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave:false, // 关闭eslint检查

    chainWebpack: config => {
        config.module
            .rule('worker')
            .test(/\.worker\.js$/)            // 文件名必须要xxx.worker.js
            .use('worker')
            .loader('worker-loader')
    }
})

```

#### index.vue

```
<template>
    <div class="HoneViewPage">
        <div class="HoneViewPageOutbox">
            <el-button @click="useWorker">calculate</el-button>
            <div>
                {{ result }}
            </div>
        </div>
    </div>
</template>
  
<script>
import Worker from './demo.worker.js'; // this.worker = new Worker(); 方式才需要引入

export default {
    name: 'HoneViewPage',
    data() {
        return {
            result: 0,
            worker: null
        }
    },

    mounted() {
        this.InitFun()
    },
    methods: {
        InitFun() {
            /* 
            **1.this.worker = new Worker() 这种方式使用，需要这样引入 import Worker from './demo.worker.js';
            **使用上面import进来的js，名字为 demo.worker.js，不可配置，路径相对比较灵活，需要worker-loader  npm install worker-loader -D
            **2.this.worker = new Worker('worker.js', { name : 'myWorker' });读取public目录下得js文件，可以配置名字，简单粗暴，不需要worker-loader 
            **worker的名字，主要在谷歌浏览器 - 控制台 - sources 中体现
            */
            //      
            this.worker = new Worker();
            this.worker.onmessage = event => {
                this.result = event.data;
                console.log('主线程收到回复，即将关闭worker连接');
                // this.worker.terminate();
            }
        },
        useWorker() {
            const path = [
                [108.566, 40.688],
                [107.53, 40.551],
            ];
            this.worker.postMessage(path)
        }
    },
    beforeDestroy() {
        this?.worker?.terminate()
    },
}
</script>
  
<style scoped lang="scss">
.HoneViewPage {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    // background: #dde3e3;

    .HoneViewPageOutbox {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        width: calc(100% - 30px);
        height: calc(100% - 30px);
        background: #dde3e3;



    }
}
</style>
  
```

#### demo.worker.js

```

import * as THREE from 'three';
onmessage = (e) => {
    console.log(e.data);
    console.log(`THREE`, THREE);
    const posArry = e.data; // e.data用于存储移动路线的数组
    const path = new THREE.LineCurve(posArry[0], posArry[1]);
    console.log(`path`, path);
    postMessage(path);

}


```

#### 应用场景

```
浏览器的JS线程和GUI渲染线程互斥
在主线程跑吃性能的同步任务，GUI渲染线程会挂起，页面不能及时响应渲染
在worker跑时，GUI渲染线程不会被挂起，页面可以正常响应
```

```
优势：
避免页面渲染阻塞。用一个worker处理主线程的任务，两者处理时间差不多，worker的优势在于处理过程中不会影响页面的渲染（e.g. 导出时 Element.message组件弹出提示，但是由于JS处理时间过长，导致页面渲染被阻塞，提示不能及时显示）
减少任务处理时间。worker可以有多个（多线程），用多个worker处理主线程的任务时，总的任务时长会减少（e.g. 压缩100张图片）
```

#### 错误处理 

```

 ERROR  Failed to compile with 1 error                                                                                                                                                                               16:12:04

 error  in ./src/pages/HoneViewPage/demo.worker.js

Syntax Error: Thread Loader (Worker 0)
Cannot read properties of undefined (reading 'options')


 ERROR  Error: Build failed with errors.
Error: Build failed with errors.
    at D:\test_project\vue_worker-loader\node_modules\@vue\cli-service\lib\commands\build\index.js:207:23
    at D:\test_project\vue_worker-loader\node_modules\webpack\lib\webpack.js:148:8
    at D:\test_project\vue_worker-loader\node_modules\webpack\lib\HookWebpackError.js:68:3
    at Hook.eval [as callAsync] (eval at create (D:\test_project\vue_worker-loader\node_modules\tapable\lib\HookCodeFactory.js:33:10), <anonymous>:6:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (D:\test_project\vue_worker-loader\node_modules\tapable\lib\Hook.js:18:14)
    at Cache.shutdown (D:\test_project\vue_worker-loader\node_modules\webpack\lib\Cache.js:150:23)
    at D:\test_project\vue_worker-loader\node_modules\webpack\lib\Compiler.js:1225:15
    at Hook.eval [as callAsync] (eval at create (D:\test_project\vue_worker-loader\node_modules\tapable\lib\HookCodeFactory.js:33:10), <anonymous>:6:1)
    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (D:\test_project\vue_worker-loader\node_modules\tapable\lib\Hook.js:18:14)
    at Compiler.close (D:\test_project\vue_worker-loader\node_modules\webpack\lib\Compiler.js:1218:23)
```
```
Syntax Error: Thread Loader(Worker 1)
 
Cannot read properties of undefined (reading 'options')
框架：@vue/cli@5 + vue@2.7 + ts

vue-cli 使用wokrer-loader 加载web woker时，使用npm run build 有很大机率会打包失败，报错如上。

thread-loader 与worker-loader有冲突。

解决：
vue.config.js 配置parallel: false  。构建正式环境关闭thread-loader。

```

See [vue-cli: Syntax Error: Thread Loader](https://blog.csdn.net/qq_35459724/article/details/127080017).
See [配置参考 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/config/#devserver-proxy).



