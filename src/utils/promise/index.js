const fs = require("fs");

// 设置状态保证resolve 只调用一次。pending时可调用。
const pending = "pending";
const fulfilled = "fulfilled";

// 发布者 resolve 订阅者 then；发布者通知订阅者
class MyPromise {
  constructor(run) {
    // run 函数(resolve)=>any
    this.observerList = [];
    // 发布者事件。对用户订阅的事件执行
    const resolve = (value) => {
      this.observerList.forEach((callback) => callback(value));
    };
    run(resolve); // 执行resolve 发布者;在resolve()时调用了
  }
  // 订阅，把需要订阅的事件放入观察者列表
  then(callback) {
    this.observerList.push(callback);
  }
}

const p = new MyPromise((notifyAll) => {
  // 路径 为基路径 后面的绝对路径
  fs.readFile("src/utils/scheduler/scheduler.js", (err, data) => {
    notifyAll(data.toString()); // resolve
  });
});
p.subscribe((data) => console.log(data)); // then
