### 用vuejs + nodejs + express + mysql + socket.io 开发游戏大厅（实现登录、注册、登出、聊天室和斗地主功能） 

这段时间学习node 和 express，想着技术总得实践，就着手开发一直想做的斗地主了，做之前先实现了个聊天室是当作熟悉一下Websocket，后面一边上班，一边下班后写写，又实现了斗地主功能（包括建房、设房间密码、加入房间、开启游戏、游戏结算、颁发连胜奖章等）。

#### 线上预览地址：http://gameHall.jxtech.fun/#/

#### 功能分析于与设计

首先我是学习nodejs、express框架时想到去开发这个项目的，所以是以后端部分为主。斗地主参考了以前的老版本qq斗地主，支持建房、设置房间密码、选择房间加入等，同时提供斗地主语音。每人注册默认赠送10000欢乐豆，由于精力有限，目前还没有写到关于加倍、底分、倍率的计算，目前是以每局500欢乐豆进行结算。例：获胜方如果为地主则赢得1000欢乐豆，如果为农民则赢得500，反之获胜方为农民的话，地主失去1000欢乐豆，农民各赢得500欢乐豆。每把游戏结束进行结算，实时更新欢乐豆数据，并会记录玩家连胜记录，如果连胜超过两把，则会弹出连胜奖章🏅。

#### 效果图

**PC端效果：**

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731816552922.jpg](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731816552922.jpg)

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731815429348.jpg](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731815429348.jpg)

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731815950460.jpg](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731815950460.jpg)

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729554720382.png](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729554720382.png)

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729554849641.png](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729554849641.png)

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729554919892.png](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729554919892.png)

![https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729555169095.png](https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1729555169095.png)

**移动端适配效果：**

<div style="display: flex; justify-content: space-between;">
   <img src="https://github.com/Fat2man/frontend-gameHall/blob/main/.image/90b6713d0550bed633dd7046a45ba64.jpg" alt="Image 2">
   <img src="https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731816139070.jpg" alt="Image 1">
   <img src="https://github.com/Fat2man/frontend-gameHall/blob/main/.image/1731816146515.jpg" alt="Image 2" >
</div>

##### <u>*目前移动端适配了登录、注册、大厅和聊天室，斗地主还没有适配*</u>

前端GitHub项目地址：https://github.com/Fat2man/game-hall

后端GitHub地址传送门：https://github.com/Fat2man/backend-gameHall

需要改进的有很多，请大家可以多提提意见。后续我会不断改进，如果觉得还可以，请star，你们的star是我前进的动力。
