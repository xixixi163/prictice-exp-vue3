const  Koa = require('koa')
// node 环境注入的能力
const fs = require("fs"); // 为什么不需要安装就可以引入，因为不同的宿主环境会给JS 赋予一些不同的能力

// 就类似：document.getElementById(Id名) --> 是浏览器注入给JS的特殊能力
const path = require("path")
const app = new Koa() // const vue = new Vue()

// node 最频繁的事情 就是在处理请求和操作文件

// 当我们浏览器上 键入地址，会发送请求到服务器端，也就是我们node这里
// 当请求来临以后会直接进入到use 注册的回调函数
app.use(async (ctx) => { // context 上下文 ---> request 请求信息 响应信息 get请求 /
    console.log("ctx", ctx.request, ctx.response)

    // 用中间件去帮我们读文件就行了 这里一个个写了 比较麻烦
    if (ctx.request.url === "/") { // 根路径
        // 意味着其他人在找我们要根路径的东西，比如你访问baidu.com
        // path.resolve(__dirname, "./index.html") 拿到index html的绝对路径
        const indexContent = await fs.promises.readFile(path.resolve(__dirname, "./index.html")); // 在服务端一般不会这么用去读文件，而是会考虑文件流，性能更好
        ctx.response.body = indexContent; // 作为响应体发给对应请求的人
        // console.log(ctx.response.body, indexContent.toString(),path.resolve(__dirname, "./index.html") )
        // 你的响应体是填充好了，那你要以什么形式发给他呢？你希望对方拿到你的东西的时候以什么方式去解析
        // json---> application/json  text/html text/javascript
        ctx.response.set("Content-Type", "text/html");  
    } 
    if (ctx.request.url === "/main.js") { 
        // 意味着其他人在找我们要根路径的东西，比如你访问baidu.com
        const mainContent = await fs.promises.readFile(path.resolve(__dirname, "./main.js")); // 在服务端一般不会这么用去读文件，而是会考虑文件流，性能更好
        ctx.response.body = mainContent; // 作为响应体发给对应请求的人
        console.log(ctx.response.body, mainContent.toString())
        // 你的响应体是填充好了，那你要以什么形式发给他呢？你希望对方拿到你的东西的时候以什么方式去解析
        // json---> application/json  text/html text/javascript
        ctx.response.set("Content-Type", "text/javascript");  
    } 
    if (ctx.request.url === "/app.vue") { 
        // 意味着其他人在找我们要根路径的东西，比如你访问baidu.com
        const mainVueContent = await fs.promises.readFile(path.resolve(__dirname, "./app.vue")); // 在服务端一般不会这么用去读文件，而是会考虑文件流，性能更好
        // 如果是 vue 文件，会做一个字符串替换 AST：mainVueContent.toString().find("<template>") 
        // 如果匹配到了就直接全部进行字符串替换
        // AST语法分析----vue.createElement()-----构建原生的dom
        ctx.response.body = mainVueContent; // 作为响应体发给对应请求的人
        console.log(ctx.response.body, mainVueContent.toString())
        // 即使看到可.vue 的文件，你也给用 js的方式去解析
        // 在浏览器和服务器眼里，你的文件都是字符串，通过head头设置解析方式，同时前面需要对文件进行处理使浏览器可以识别请求
        ctx.response.set("Content-Type", "text/javascript");  
    } 
    // 比如后台给我们一个获取用户信息的接口 api/getUserInfo post
    if(ctx.request.url === '/api/getUserInfo') {
        // 去数据库找到用户信息然后返回给前端
    }
    // 如果当前文件的url是以js后缀结尾的
    // 我们的root js文件一定是和html文件在一个目录的对不对
    // if (ctx.request.url.endsWith(".js")) {
    //     const JSContent = await fs.promises.readFile(path.resolve(__dirname, "." + ctx.request.url)); // 在服务端一般不会这么用
    //     console.log("JSContent", JSContent);
    //     // 直接进行alias的替换
    //     const lastResult = aliasResolver(viteConfig.resolve.alias, JSContent.toString());
    //     ctx.response.body = lastResult; // 作为响应体发给对应的请求的人
    //     // 你的响应体是填充好了，那你要以什么形式发给他呢？你希望对方拿到你的东西的时候以什么方式去解析
    //     // json---> application/json  text/html text/javascript
    //     ctx.response.set("Content-Type", "text/javascript");
    // }
})

// 启动服务，也就是我们跑 yarn dev
app.listen(3535, () => {
    console.log("vite dev serve listen on 3535")
})