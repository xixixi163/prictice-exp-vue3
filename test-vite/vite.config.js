// /**
//  * @type import("vite").UserConfig
//  */
// const viteConfig = {
//     optimizeDeps: {
//         exclude: []
//     }
// }

// export default viteConfig

import { defineConfig, loadEnv } from "vite";
import viteBaseConfig from "./vite.base.config";
import viteDevConfig from "./vite.dev.config";
import viteProdConfig from "./vite.prod.config";

// 策略模式 代替 if else  写成函数方便调试 添加逻辑
const envResolver = {
    "build": () => {
        console.log('build')
        // 解构形式 返回
        return { ...viteBaseConfig, ... viteProdConfig }
    },
    "serve": () => {
        console.log("serve")
        return Object.assign({}, viteBaseConfig, viteDevConfig) // 我们新配置里可能会被配置 envDir名字并不是叫 env
    }
}

export default defineConfig(( {command, mode} ) => {
    console.log("command:", command)
    console.log("process", process.cwd(), mode)

    // 第三个参数可以“” 表示默认读取 .env 文件，否则读取指定文件
// 第二个参数 不一定要 process.cwd()，如果env文件在此下面可以直接使用，这个地方是指envDir的目录位置
    const env = loadEnv(mode, process.cwd(), "")

    console.log('env:', env);
    // 是什么环境，取决于我们敲的启动命令是开发还是生产
    return envResolver[command]();
    // if (command === 'build') {

    // } else {

    // }
})