const pending = "pending";
const fulfilled = "fulfilled";
const rejected = "rejected";

export default class MyPromise {
  constructor(run) {
    // resolve 闭包，创建promise时 发布，then 是订阅
    // then 内部 调用
    this.resolvedCallback = [];
    this.rejectedCallback = [];
    this.data = void 666; // 存异步的结果,也就是settime out 的结果
    this.status = pending;
    // 发布闭包
    const resolve = (value) => {
      if (this.status === pending) {
        this.status = fulfilled;
        this.data = value;
        this.resolvedCallback.forEach((callback) => {
          // console.log(callback, 'resolve--------');
          callback(this.data);
        });
      }
    };
    // reject 闭包
    const rejected = (err) => {
      if (this.status === pending) {
        this.status = rejected;
        this.data = err;
        this.rejectedCallback.forEach((callback) => {
          callback(this.data);
        });
      }
    };
    // 对构造器里传入的函数进行try catch
    try {
      run(resolve, rejected); // 执行传进来的函数 并且传递闭包，使在run内部调用
    } catch (error) {
      rejected(error); // 发布reject
    }
  }
  then(onResolved, onRejected) {
    // 转为函数
    onResolved =
      typeof onResolved === "function" ? onResolved : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    // 链式调用，那么需要返回promise 才可以继续使用class 中的then
    // pending 状态，继续订阅 push；因为pending状态 可以发布订阅
    // fulfilled 状态，直接返回新promise；返回上一次promise 对象的结果给新的promise对象
    switch (this.status) {
      case pending: {
        return new MyPromise((resolve, reject) => {
          this.resolvedCallback.push((value) => {
            // 再包一层
            try {
              // 判断then传入的回调返回的类型
              const result = onResolved(value);
              // console.log("pending: ", result);
              if (result instanceof MyPromise) {
                // 如果是promise 可以直接调用then，promise 需要订阅，脱去函数外衣返回值
                result.then(resolve, reject);
              } else {
                resolve(result); // 执行闭包
              }
            } catch (error) {
              reject(error); // 捕获异常，将异常发布
            }
          });
          this.rejectedCallback.push((err) => {
            try {
              const result = onRejected(err);
              //    console.log("pending reject push: ", result);
              if (result instanceof MyPromise) {
                result.then(resolve, reject);
              } else {
                reject(err);
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      case fulfilled: {
        return new MyPromise((resolve, reject) => {
          try {
            const result = onResolved(this.data); // 上一次pending的结果
            // console.log("fulfilled: ", result);
            if (result instanceof MyPromise) {
              result.then(resolve, reject); // 订阅
            } else {
              resolve(result); // 执行闭包 发布逻辑
            }
          } catch (error) {
            reject(error);
          }
        });
      }

      case rejected: {
        return new MyPromise((resolve, reject) => {
          try {
            const result = onRejected(this.data);
            // console.log("rejected: ", result);
            if (result instanceof MyPromise) {
              result.then(resolve, reject); // promise 需要订阅，脱去函数外衣返回值
            } else {
              reject(result); // 发布
            }
          } catch (error) {
            reject(error);
          }
        });
      }

      default:
        break;
    }
  }

  // 订阅reject
  catch(onRejected) {
    return this.then(void 666, onRejected);
  }

  // resolve 发布 Promise.resolve 等价于new Promise(resolve => resolve('foo'))； MyPromise.resolve
  // 将传入的对象转为promise对象
  static resolve(p) {
    if (p instanceof MyPromise) {
      return p.then(); // 返回promise  也是走到resolve 脱去函数外衣
    }
    return new MyPromise((resolve) => {
      resolve(p); // 发布
    });
  }
  // reject 发布 也就是构造函数内部的rejected
  static reject(p) {
    if (p instanceof MyPromise) {
      return p.catch();
    }
    return new MyPromise((resolve, reject) => {
      reject(p);
    });
  }

  // all Promise.all  返回interior 结果。全为 fulfilled 或 有一个reject 返回结果
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      try {
        let count = 0;
        let len = promises.length;
        // 结果列表
        let value = [];
        for (const promise of promises) {
          MyPromise.resolve(promise).then((v) => {
            count++;
            value.push(v);
            if (count === len) {
              resolve(value); // 发布，返回结果
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
// 下面是一个用Promise对象实现的Ajax操作的例子
const getJSON = (url) => {
  const promise = new MyPromise((resolve, reject) => {
    let client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

    function handler() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    }
  });

  return promise;
};

export const testPromise = () => {
  const p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("error---"));
      resolve("set time out"); // 执行闭包，还要保证只执行一次
      resolve("other--");
    });
  });
  p.then((data) => data + "8989")
    .then((data) => data.toUpperCase())
    .then(console.log) // 订阅，
    // .catch(console.log)
    .catch((err) => console.log(err));
  // .then(() => {}, err => console.log(err))

  const promises = [2, 3, 5, 7, 11, 13].map((id) => {
    return getJSON("/post/" + id + ".json");
  });

  MyPromise.all(promises)
    .then((posts) => {
      console.log("all: ", posts);
    })
    .catch((reason) => {
      console.log("all catch:", reason);
    });
};
