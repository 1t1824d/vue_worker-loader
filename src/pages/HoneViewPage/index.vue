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
  