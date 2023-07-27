import { defineConfig } from "vite";

export default defineConfig({
    optimizeDeps: {
        exclude: [] // 将指定数组的依赖不进行依赖预构建，也就是不把依赖的其他打包类型转为esm
    },
    envPrefix: 'ENV_' // 配置vite 注入客户端 环境变量校验的env 前缀，也就是修改环境变量的指定前缀，默认VITE
})