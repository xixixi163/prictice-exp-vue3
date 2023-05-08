export default class Scheduler {
  constructor(num = 2) {
    this.waitTasks = []; // 待执行的任务队列
    this.executingTasks = []; // 正在执行的任务队列
    this.maxExecutingNum = num; // 最大同时运行的任务数
  }
  add(promiseMaker) {
    // promiseMaker()
    // 未达到最大任务数则加入可执行队列 此处异步
    if (this.executingTasks.length < this.maxExecutingNum) {
      this.run(promiseMaker);
    } else {
      this.waitTasks.push(promiseMaker);
    }
  }
  run(promiseMaker) {
    // debugger
    // 加入可执行队列 此处同步执行
    const len = this.executingTasks.push(promiseMaker);
    const index = len - 1;
    // 执行
    promiseMaker().then(() => {
      console.log(this.executingTasks.length, this.waitTasks);
      this.executingTasks.splice(index, 1);
      // 等待队列 有任务，则执行对应任务
      if (this.waitTasks.length > 0) {
        console.log("wait tasks");
        // run 等待队列的第一个任务
        this.run(this.waitTasks.shift());
      }
    });
  }
}
