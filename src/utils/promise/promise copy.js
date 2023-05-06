
// 设置状态保证resolve 只调用一次。pending时可调用。
const pending = "pending";
const fulfilled = "fulfilled"

// 发布者 resolve 订阅者 then；发布者通知订阅者
export default class MyPromise {
    constructor(run) { // run 函数(resolve)=>any
        this.resolvedCallback = [];
        this.status = pending;
        // 存 resolve 的异步结果
        this.data = void 666;
        // 发布者事件。对用户订阅的事件执行.resolve 执行then传入的回调。
        const resolve = (value) => {
            // resolve 要保证只能调用一次，所以设置状态
            if (this.status === pending) {
                this.status = fulfilled;
                this.data = value;
                this.resolvedCallback.forEach(callback => callback(value))
                console.log(this.resolvedCallback, this.data, 'resolve');
            }
        };
        run(resolve); // 执行resolve 发布者;在resolve()时调用了
    }
    // onResolved 回调；订阅，把需要订阅的事件放入观察者列表。链式调用： then 返回新的promise。
    // pending 状态：返回新的promise，并将回调注册到队列中；fulfilled状态：返回新的promise，上一个promise的结果给新的promise
    then(onResolved) {
        // 1.处理成函数
        onResolved = typeof onResolved === 'function' ? onResolved : value => value;
        // 2.区分状态
        switch(this.status) {
            case pending: {
                return new MyPromise((resolve) => {
                    // 2.1.1 注册回调 所以需要包装成回调
                    this.resolvedCallback.push(value => {
                        // 2.1.2 判断then 接收的回调返回 是不是一个 myPromise 对象
                        const result = onResolved(value);
                        // 2.1.3 为promise 对象，直接使用result的then，返回结果
                        if (result instanceof MyPromise) {
                            result.then(resolve)
                        } else {
                            resolve(result) // 闭包
                        }
                    })
                })
            }
            case fulfilled: {
                return new MyPromise((resolve) => {
                    // 传入上一个promise 的对象结果，使链式调用
                    const result = onResolved(this.data)
                    if (result instanceof MyPromise) {
                        result.then(resolve)
                    } else {
                        resolve(result)
                    }
                    
                })
            }
        }
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