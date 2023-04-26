
// 设置状态保证resolve 只调用一次。pending时可调用。
const pending = "pending";
const fulfilled = "fulfilled"

// 发布者 resolve 订阅者 then；发布者通知订阅者
export default class MyPromise {
    constructor(run) { // run 函数(resolve)=>any
        this.observerList = [];
        this.status = pending;
        
        // 发布者事件。对用户订阅的事件执行
        const resolve = (value) => {
            // resolve 要保证只能调用依次，所以设置状态
            if (this.status === pending) {
                this.status = fulfilled;
                this.observerList.forEach(callback => callback(value))
                console.log(this.observerList, 'resolve');
            }
        };
        run(resolve); // 执行resolve 发布者;在resolve()时调用了
    }
    // 订阅，把需要订阅的事件放入观察者列表
    then(callback) {
        this.observerList.push(callback)
    }
}

export const testPromise = () => {
    const p = new MyPromise((resolve) => {
        // resolve调用需要在异步任务中，这样执行顺序就为 then ——> resolve ，即订阅的消息进入池子，发布者进行发布。
        // 为什么顺序是这样，一进来加载script（mro），然后执行所有mri，在走mro，这时也是就settimeout
        setTimeout(() => {
            // resolve 要保证只能调用一次，所以设置状态
            resolve('settime out')
            resolve('hello')
        })
      });
    p.then(data => console.log(data))  // then
}