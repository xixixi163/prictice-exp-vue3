
const pending = 'pending';
const fulfilled = 'fulfilled';

export default class MyPromise {
    constructor(run) {
        // resolve 闭包，创建promise时 发布，then 是订阅
        // then 内部 调用
        this.resolvedCallback = [];
        this.data = void 666; // 存异步的结果,也就是settime out 的结果
        this.status = pending;
        const resolve = (value) => {
            if(this.status === pending) {
                this.status = fulfilled
                this.data = value
                this.resolvedCallback.forEach(callback => {
                    console.log(callback, 'resolve--------');
                    callback(this.data)
                })
            }
        }
        run(resolve) // 执行传进来的函数 并且传递闭包，使在run内部调用
    }
    then(onResolved) {
        // 链式调用，那么需要返回promise 才可以继续使用class 中的then
        // pending 状态，继续订阅 push；因为pending状态 可以发布订阅
        // fulfilled 状态，直接返回新promise；返回上一次promise 对象的结果给新的promise对象
        switch (this.status) {
            case pending: {
                return new MyPromise((resolve) => {
                    this.resolvedCallback.push(value => { // 再包一层
                        // 判断then传入的回调返回的类型
                        const result = onResolved(value)
                        console.log("pending: ", result);
                        if (result instanceof MyPromise) {
                            // 如果是promise 可以直接调用then，
                            result.then(resolve)
                        } else {
                            resolve(result) // 执行闭包
                        }
                    })
                })
            }
                
            
            case fulfilled: {
                return new MyPromise(resolve => {
                    const result = onResolved(this.data) // 上一次pending的结果
                    console.log("fulfilled: ", result);
                    if(result instanceof MyPromise) {
                        result.then(resolve) // 订阅
                    } else {
                        resolve(result) // 执行闭包 发布逻辑
                    }
                })
            }

            default:
                break;
        }
    }
}

export const testPromise = () => {
    const p = new MyPromise((resolve) => {
        setTimeout(() => {
            resolve('set time out')  // 执行闭包，还要保证只执行一次
            resolve('other--')
        })
    })
    p.then(data => data + '8989')
    .then(data => data.toUpperCase())
    .then(console.log) // 订阅，
}