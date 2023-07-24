// /**
//  * @type import("vite").UserConfig
//  */
// const viteConfig = {
//     optimizeDeps: {
//         exclude: []
//     }
// }

// export default viteConfig

import { defineConfig } from "vite";
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
        return Object.assign({}, viteBaseConfig, viteDevConfig)
    }
}

export default defineConfig(( {command} ) => {
    console.log("command:", command)
    return envResolver[command]();
    // if (command === 'build') {

    // } else {

    // }
})