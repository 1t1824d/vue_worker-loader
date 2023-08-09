const {
    defineConfig
} = require('@vue/cli-service')
const path = require("path");
const resolve = function (dir) {
    return path.join(__dirname, dir);
};
module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config.module
            .rule('svg-sprite')
            .use('svgo-loader')
            .loader('svgo-loader')
    },

    publicPath: "./", //process.env.NODE_ENV === "production" ? "./" : "./",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: true, // 是否开启eslint保存检测
    productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@v", resolve("src/views"))
            .set("@c", resolve("src/components"))
            .set("@u", resolve("src/utils"))
            .set("@s", resolve("src/service")); /* 别名配置 */
        config.optimization.runtimeChunk("single");
        config.module
            .rule('worker')
            .test(/\.worker\.js$/)            // 文件名必须要xxx.worker.js
            .use('worker')
            .loader('worker-loader')

    },
    configureWebpack: config => {
        // 环境判断
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.optimization.minimizer[0].options.minimizer.options.compress = Object.assign(
                config.optimization.minimizer[0].options.minimizer.options.compress, {
                drop_console: true
            }
            );
        } else {
            // 为开发环境修改配置...
        }
    },
    pluginOptions: {
        // 'style-resources-loader': {
        //     preProcessor: 'scss',
        //     patterns: [path.resolve(__dirname, './src/assets/globalscss/*.scss'), ]
        // }
    },
    devServer: {
        hot: true,
        open: false,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        proxy: {
            '/api': {
                target: 'https://192.168.1.161:8901/api/',
                ws: true, //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: { //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api': ''
                }
            },

        }
    }
})