
//观察者模式
// class NewsPublisher {
//   constructor() {
//     this.subscribers = []
//   }
//   subscribe(observe) {
//     this.subscribers.push(observe)
//   }
//   unsubscribe(observer) {
//     this.subscribers.filter(sub => sub !== observer)
//   }
//   notifyAll(news) {
//     this.subscribers.forEach(sub => sub.update(news))
//   }
//   publishNews(news) {
//     this.notifyAll(news)
//   }
// }
// class NewsSubscriber {
//   constructor(name) {
//     this.name = name
//   }
//   update(news) {
//     console.log(`${this.name}收到新闻：${news}`);
//   }
// }
// const publisher = new NewsPublisher()
// const sub1 = new NewsSubscriber('张三')
// const sub2 = new NewsSubscriber('李四')
// publisher.subscribe(sub1)
// publisher.subscribe(sub2)
// publisher.publishNews('兄弟们')

// //模块模式
// const myModule = (function () {
//   let name = 'zhangsan'
//   let age = '18'
//   function call() {
//     console.log(`你好,我是${name},今年${age}岁`);
//   }
//   return {
//     publicMethod: function () {
//       call()
//       console.log('哈哈哈哈');
//     }
//   }
// })()
// myModule.publicMethod()

// //单例模式
// class SingleExample {
//   constructor() {
//     if (SingleExample.instance) {
//       return SingleExample.instance
//     }
//     this.config = {}
//     SingleExample.instance = this
//   }
//   setConfig(key, value) {
//     this.config[key] = value
//   }
//   getConfig(key) {
//     return this.config[key]
//   }
// }
// let sin1 = new SingleExample()
// let sin2 = new SingleExample()
// console.log(sin1 === sin2);

// //发布-订阅模式
// class Pub {
//   constructor() {
//     this.sub = {}
//   }
//   addSub(event, callback) {
//     if (!this.sub[event]) {
//       this.sub[event] = []
//     }
//     this.sub[event].push(callback)
//   }
//   unSub(event, callback) {
//     if (this.subp[event]) {
//       this.sub[event].filter(cb => cb !== callback)
//     }
//   }
//   publishNews(event, data) {
//     this.sub[event].forEach(cb => cb(data))
//   }
// }
// const pub = new Pub()
// const subevent1 = (address) => {
//   console.log(`快递送到了${address}`);
// }
// const subevent2 = (address) => {
//   console.log(`水果放在了${address}`);
// }
// pub.addSub('news', subevent1)
// pub.addSub('news', subevent2)
// pub.publishNews('news', '天居园8号楼')

// //命令模式
// class TestLight {
//   on() {
//     console.log('开灯了');
//   }
//   off() {
//     console.log('关灯了')
//   }
//   adjust(level) {
//     console.log(`灯光亮度调整为${level}`);
//   }
// }
// class Comm {
//   constructor(receiver) {
//     this.receiver = receiver
//   }
// }
// class LightOn extends Comm {
//   execute() {
//     this.receiver.on()
//   }
// }
// class LightOff extends Comm {
//   execute() {
//     this.receiver.off()
//   }
// }
// class LightAdjust extends Comm {
//   constructor(receiver, level) {
//     super(receiver)
//     this.level = level
//   }
//   execute() {
//     this.receiver.adjust(this.level)
//   }
// }
// class RemoteCaller {
//   onButton(executor) {
//     executor.execute()
//   }
// }
// const test = new TestLight()
// const lighton = new LightOn(test)
// const lightOff = new LightOff(test)
// const lightAdjust = new LightAdjust(test, 88)
// const remoter = new RemoteCaller()
// remoter.onButton(lightAdjust)
// remoter.onButton(lightOff)

// //工厂模式
// class VehicleFactory {
//   createVehicle(type) {
//     switch (type) {
//       case 'car':
//         return new Car()
//       case 'bike':
//         return new Bike()
//       case 'subway':
//         return new Subway()
//       default:
//         throw new Error('未知的车辆类型');
//     }
//   }
// }
// class Car {
//   constructor() {
//     this.name = 'car'
//     console.log(`my name is ${this.name}`);
//   }
//   drive() {
//     console.log('car is working');
//   }
// }
// class Bike {
//   constructor() {
//     this.name = 'bike'
//     console.log(`my name is ${this.name}`);
//   }
//   drive() {
//     console.log('bike is working');
//   }
// }
// const factory = new VehicleFactory()
// const v1 = factory.createVehicle('car')
// const v2 = factory.createVehicle('bike')
// v1.drive()
// v2.drive()

// // 装饰器模式
// class Coffe {
//   cost() {
//     return 5
//   }
//   descriptions() {
//     return '这是普通咖啡'
//   }
// }
// function addMilk(coffee) {
//   const cost = coffee.cost()
//   const description = coffee.description()
//   coffee.cost = () => cost + 2
//   coffee.description = () => `${description}+牛奶`
//   return coffee
// }
// const coffee = new Coffe()
// const mycoffe = addMilk(coffee)
// console.log(mycoffe.cost());



//宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。
//想象一下，家里有一个万能遥控器，每天回家的时候，只要按一个特别的按钮，它就会帮我们关上房间门，顺便打开电脑并登录QQ。
//macroCommand.add 方法表示把子命令添加进宏命令对象，当调用宏命令对象的execute 方法时，会迭代这一组子命令对象，并且依次执行它们的execute 方法
// var closeDoorCommand = {
//   execute: function () {
//     console.log('关门');
//   }
// };
// var openPcCommand = {
//   execute: function () {
//     console.log('开电脑');
//   }
// };
// var openQQCommand = {
//   execute: function () {
//     console.log('登录QQ');
//   }
// };
// var MacroCommand = function () {
//   return {
//     commandsList: [],
//     add: function (command) {
//       this.commandsList.push(command);
//     },
//     execute: function () {
//       for (var i = 0, command; command = this.commandsList[i++];) {
//         command.execute();
//       }
//     }
//   }
// };
// var macroCommand = MacroCommand();
// macroCommand.add(closeDoorCommand);
// macroCommand.add(openPcCommand);
// macroCommand.add(openQQCommand);
// macroCommand.execute();

// 类装饰器
function logClass(target) {
  console.log(`Class name: ${target.name}`);
}

@logClass
class Person {
  constructor(name) {
    this.name = name;
  }
}







