<template>
  <div class="pokerRoom">
    <audio ref="audio" v-if="audio" :src="require(`@/assets/music/${audio}.wav`)"></audio>
    <audio ref="alarm" src="~@/assets/music/alarm.wav"></audio>
    <audio ref="select" src="~@/assets/music/select.wav"></audio>
    <div class="pokerRoom-header">
      <div class="operation">
        <i
          class="iconfont icon-fanhui"
          style="font-size:30px;color:rgb(237, 219, 147);"
          @click="goBack"
          v-click-sound
        ></i>
        <i class="iconfont icon-talk" style="font-size:35px;color:rgb(237, 219, 147);" v-click-sound></i>
      </div>
    </div>
    <div class="pokerRoom-box">
      <div
        v-for="(user, index) in roomUser"
        :key="index"
        :class="[index === 1 ? 'me' : 'others', {winActive1:gameEnding}]"
      >
        <!-- 房间玩家用户信息 -->
        <p v-if="user && !gameEnding" class="Jxd">
          <img src="~@/assets/jxd.jpeg" width="64px" />
          <span>{{user.score }}</span>
        </p>
        <img v-if="user?.user_pic" :src="user?.user_pic" class="avatarImg" />
        <p>{{ user?.userName }}</p>
        <span v-if="isReady(user)">{{ user?.ready ? '已准备' : '未准备' }}</span>
        <div v-if="user?.landlord">
          <img src="~@/assets/dizhu.png" />
        </div>
      </div>
      <ul v-if="!start" class="gameButton">
        <li>
          <img src="~@/assets/start.png" v-click-sound v-if="Homeowner" @click="startGame" />
        </li>
        <el-button
          v-click-sound
          type="success"
          round
          v-show="!Homeowner && !userInfo?.ready"
          @click="goReady"
        >立即准备</el-button>
        <li v-show="!Homeowner && userInfo?.ready">
          <img src="~@/assets/readied.png" />
          <el-button
            v-click-sound
            type="primary"
            round
            v-show="!Homeowner && userInfo?.ready"
            @click="cancelReady"
          >取消准备</el-button>
        </li>
      </ul>
      <div v-else class="poker">
        <div class="playerPoker">
          <ul class="left">
            <!-- 左边玩家的牌 -->
            <template v-if="gameEnding">
              <li v-for="(item,index) in roomUser[0].poker">
                <img :src="require(`@/assets/poker/${item}.png`)" />
              </li>
            </template>
            <template v-else>
              <li v-for="(item,index) in roomUser[0].poker">
                <img src="~@/assets/poker/rear.png" />
              </li>
            </template>
            <li v-show="roomUser[0].countdown" style="position:absolute;left:140%;top:40%">
              <img src="~@/assets/alarm-clock.png" style="width:50px"/>
              <p class="countDown">{{roomUser[0].countdown}}</p>
            </li>
            <template v-if="!roomUser[0].countdown">
              <ul class="leftLastPoker">
                <li v-for="item in roomUser[0].lastPoker">
                  <img :src="require(`@/assets/poker/${item}.png`)" />
                </li>
              </ul>
            </template>
          </ul>
          <ul class="me">
            <li
              v-for="(item, index) in roomUser[1].poker"
              :key="item"
              @click="clickPoker(item)"
              :class="{active:floatingPoker.includes(item)}"
              :style="{zIndex: 10+ index}"
            >
              <img :src="require(`@/assets/poker/${item}.png`)" />
            </li>
            <li
              v-show="roomUser[1].countdown"
              :style="{position:'absolute',bottom:isMobile?'100%':'110%',display:'flex',justifyContent:'center',left:'32%',alignItems:'center',lineHeight:'30px'}"
            >
              <img
                v-show="hasDizhu"
                v-click-sound
                src="~@/assets/play.png"
                class="img1"
                @click="playPoker"
              />
              <button v-show="!hasDizhu" v-click-sound class="button1" @click="callLandlord(1)">叫地主</button>
              <div style="position:relative;margin:0 15px" :class="{alarm:isAlarm}">
                <img src="~@/assets/alarm-clock.png" />
                <p class="countDown">{{roomUser[1].countdown}}</p>
              </div>
              <button v-show="!hasDizhu" v-click-sound class="button2" @click="callLandlord(-1)">不叫</button>
              <img
                v-show="hasDizhu"
                v-click-sound
                src="~@/assets/pass.png"
                class="img1"
                @click="passPoker"
              />
            </li>
            <template v-if="!roomUser[1].countdown">
              <ul class="meLastPoker">    
                <li v-for="item in roomUser[1].lastPoker">
                  <img :src="require(`@/assets/poker/${item}.png`)" />
                </li>
              </ul>
            </template>
          </ul>
          <ul class="right">
            <!-- 右边玩家的牌 -->
            <template v-if="gameEnding">
              <li v-for="(item,index) in roomUser[2].poker">
                <img :src="require(`@/assets/poker/${item}.png`)" />
              </li>
            </template>
            <template v-else>
              <li v-for="(item,index) in roomUser[2].poker">
                <img src="~@/assets/poker/rear.png" />
              </li>
            </template>
            <li v-show="roomUser[2].countdown" style="position:absolute;bottom:60%;right:120%">
              <img src="~@/assets/alarm-clock.png" style="width:50px"/>
              <p class="countDown">{{roomUser[2].countdown}}</p>
            </li>
            <template v-if="!roomUser[2].countdown">
              <ul class="rightLastPoker">
                <li v-for="item in roomUser[2].lastPoker">
                  <img :src="require(`@/assets/poker/${item}.png`)" />
                </li>
              </ul>
            </template>
          </ul>
          <ul class="lord">
            <!-- 底牌 -->
            <template v-if="hasDizhu">
              <li v-for="item in lordSet">
                <img :src="require(`@/assets/poker/${item}.png`)" />
              </li>
            </template>
            <template v-else>
              <li v-for="item in 3">
                <img :src="require(`@/assets/poker/rear.png`)" />
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="gameEnding"
      :show-close="false"
      width="600px"
      :close-on-click-modal="false"
      class="gameSettle"
    >
      <GameSettle
        :resultTitle="resultTitle"
        :totalCoins="totalCoins"
        :players="roomUser"
        @exit-room="handleExitRoom"
        @continue-game="handleContinueGame"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="winStreakDialog"
      width="640px"
      :close-on-click-modal="false"
      class="victoryBanner"
    >
      <VictoryBanner
        :winStreak="userInfo.winStreak"
        :avatar="userInfo.user_pic"
        :nickname="userInfo.userName"
      />
    </el-dialog>
    <!-- 添加移动端菜单按钮 -->
    <div class="mobile-menu" v-show="isMobile">
      <i class="iconfont icon-menu" @click="toggleMenu"></i>
    </div>
  </div>
</template>
<script>
import Header from "../../components/header.vue";
import GameSettle from "./components/gameSettle.vue";
import VictoryBanner from "./components/victoryBanner.vue";
export default {
  name: "pokerRoom",
  components: {
    Header,
    GameSettle,
    VictoryBanner
  },
  data() {
    return {
      roomUser: [],
      userInfo: {},
      socket: {},
      roomUgameEndingser: {},
      Homeowner: false, //是否是房主
      pokerSet: {}, //洗牌后的扑克牌对象
      myPokerSet: {}, //自己手中的牌
      leftPokerSet: {}, // 左边玩家的牌
      rightPokerSet: {}, //右边玩家的牌
      lordSet: {}, //底牌
      floatingPoker: [], //点击浮起的牌
      countdown: [], //倒计时数组  顺序[左边，我，右边]
      hasDizhu: false, //是否有了地主
      start: false, //游戏是否开始
      flag: false, //区分行为是手动操作还是倒计时结束   true 手动点击操作
      audio: null, //播放音频类型
      gameEnding: false, //游戏是否结束
      winStreakDialog: false, //连胜弹框
      winner: "", //赢家
      isMobile: false,
      showMobileMenu: false
    };
  },
  watch: {
    "userInfo.countdown"(newval) {
      if (newval === 5) {
        this.$refs["alarm"].play();
      } else if (this.hasDizhu && !this.flag && newval === 0) {
        //玩家没操作，倒计时结束时自动过
        this.passPoker();
      }
    },
    "roomUser[1].poker"(newval) {
      if (newval.length === 0) this.gameOver();
    }
  },
  computed: {
    resultTitle() {
      return this.winner === this.userInfo.userName ? "胜利" : "失败";
    },
    totalCoins() {
      if (this.userInfo.landlord) {
        return this.winner === this.userInfo.userName ? "+1000" : "-1000";
      } else {
        return this.winner === this.userInfo.userName ? "+500" : "-500";
      }
    },
    isAlarm() {
      return this.userInfo.countdown < 6;
    },
    hasCall() {
      //有人叫了地主
      if (
        this.userInfo.call !== 1 &&
        this.roomUser.some(item => item?.call > 0)
      ) {
        return 1;
      } else if (
        this.userInfo.call === 1 &&
        this.roomUser.some((item, index) => index !== 1 && item?.call > 0)
      ) {
        return 2;
      } else {
        return 0;
      }
    }
  },
  methods: {
    isReady(user) {
      return (
        !this.start &&
        user &&
        user.userName !== this.userInfo.userName &&
        !this.Homeowner
      );
    },
    playPoker() {
      if (this.floatingPoker.length) {
        this.socket.emit("playPoker", this.floatingPoker);
      }
    },
    passPoker() {
      this.flag = true;
      this.floatingPoker = [];
      this.socket.emit("passPoker");
    },
    playerSort(data) {
      //玩家排序  '我'始终在中间
      let newSet = new Set();
      let keys = Object.keys(data).filter(key => key !== this.socket.id);
      [keys[0], this.socket.id, keys[1]].forEach(key => newSet.add(data[key]));
      this.roomUser = Array.from(newSet);
      this.userInfo = this.roomUser[1];
    },
    callLandlord(e) {
      //叫（不叫）地主
      this.socket.emit("callLandlord", {
        e,
        lordSet: this.lordSet,
        hasCall: this.hasCall
      });
    },
    clickPoker(item) {
      let index = this.floatingPoker.indexOf(item);
      this.$refs["select"].play();
      if (index !== -1) {
        //卡片浮起再次点击卡片复原
        this.floatingPoker.splice(index, 1);
      } else {
        this.floatingPoker.push(item);
      } 
    },
    cancelReady() {
      this.socket.emit("goReady", false);
    },
    goReady() {       
      this.socket.emit("goReady", true);
    },
    startGame() {
      if (Object.keys(this.roomUser).length !== 3) return;    
      for (let i in this.roomUser) {
        if (!this.roomUser[i]?.Homeowner && !this.roomUser[i]?.ready)
          return this.$message.warning("还有人未准备");
      }
      this.socket.emit("goStart");
    },
    goBack() {
      this.$router.go(-1);
      this.socket.emit("leaveRoom");
    },
    gameOver() {
      //游戏结束，通知服务端
      this.socket.emit("overToServer");
    },
    handleExitRoom() {
      // 退出房间
      this.goBack();
    },
    handleContinueGame() {
      // 在这里处理继续游戏逻辑
      this.gameEnding = false; //关闭结算弹框
      this.winner = null; //清空获胜人信息
      this.start = false; //初始化为游戏未开始
      this.lordSet = [];
      this.hasDizhu = false; //恢复为没有地主产生
      this.socket.emit("continueGame"); //通知服务端继续游戏，重置相关数据
    },
    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
      if(this.isMobile) {
        // 移动端初始化逻辑
        this.initMobileView();
      }
    },
    initMobileView() {
      // 移动端特定初始化
    },
    toggleMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    // 计算卡牌位置
    calculateCardPosition(index, total) {
      const maxAngle = 40; // 最大展开角度
      const angle = (index - (total - 1) / 2) * (maxAngle / total);
      return angle;
    },
    
    // 更新卡牌布局
    updateCardsLayout() {
      const cards = this.roomUser[1].poker;
      const total = cards.length;
      
      cards.forEach((card, index) => {
        const angle = this.calculateCardPosition(index, total);
        // 可以通过 DOM 操作或数据绑定来更新卡牌位置
      });
    }
  },
  created() {
    this.socket = this.$store.state.socket;
    this.socket.emit("getRoomUser");
    this.socket.on("roomUser", data => {
      this.playerSort(data);
      this.userInfo = data[this.socket.id];
      this.Homeowner = this.userInfo?.Homeowner; //获取当前用户是否是房主
    });
    this.socket.on("hasDizhu", data => {
      this.hasDizhu = data;
    });
    this.socket.on("playToClient", data => {
      this.flag = true;
      this.playerSort(data);
      this.userInfo = data[this.socket.id];
      if (this.userInfo.poker.length === 0) this.gameOver();
      this.floatingPoker = [];
    });
    this.socket.on("poker", (data, lord) => {
      //取牌
      this.playerSort(data);
      this.start = true;
      this.lordSet = lord;
    });
    this.socket.on("landLord", data => {
      //监听玩家地主类别消息事件
      this.playerSort(data);
      this.flag = false;
    });
    this.socket.on("audio", data => {
      //接受播放音频信息
      this.audio = data;
      this.$nextTick(() => {
        this.$refs["audio"].play();
      });
    });
    this.socket.on("overToClient", (data, rooms) => {
      this.gameEnding = true;
      this.winner = data;
      this.playerSort(rooms);
      this.userInfo = rooms[this.socket.id];
      if (this.userInfo.winStreak > 1) this.winStreakDialog = true; //连胜两局及以上时，弹框提示
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo")); //修改本地用户信息的score值
      userInfo.score = this.userInfo.score;
      sessionStorage.setItem("userInfo", JSON.parse(userInfo));
    });
  },
  mounted() {
    // 检测是否为移动设备
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    this.socket.emit("leaveRoom");
    window.removeEventListener('resize', this.checkDevice);
  }
};
</script>

<style lang="less" scoped>
.pokerRoom {
  height: 100vh;
  width: 100%;
  background: url('~@/assets/desk.jpg') center/cover no-repeat;
  min-height: 450px;
  position: relative;

  .pokerRoom-header {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
    height: 3.75rem;
    display: flex;
    justify-content: center;
    padding: 0 20px;
    align-items: center;

    .operation {
      width: 120px;
      display: flex;
      justify-content: space-between;
    }
  }

  .pokerRoom-box {
    height: calc(100% - 3.75rem);
    position: relative;

    .winActive2 {
      position: absolute;
      animation: WinMove2 2s forwards;
    }

    @keyframes WinMove2 {
      from {
        bottom: 10%;
        left: 2%;
      }
      to {
        bottom: 81%;
        left: 47%;
        display: flex;
      }
    }

    .avatarImg {
      width: 60px;
      height: 60px;
      border: 3px solid rgb(254, 242, 118);
      object-fit: cover;
    }

    p {
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    .me {
      position: absolute;
      left: 2%;
      bottom: 10%;
      z-index: 99999;

      .img1 {
        object-fit: scale-down;
        &:hover {
          transform: scale(1.05);
        }
      }

      .button1, .button2 {
        width: 110px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        border: none;
        font-weight: 700;
        border-radius: 999px;
        font-size: 16px;
        cursor: url('~@/assets/sword.png'), auto !important;
        &:hover {
          transform: scale(1.05);
        }
      }

      .button1 {
        background-color: rgb(53, 160, 218);
      }

      .button2 {
        background-color: rgb(247, 156, 70);
      }
    }

    .others {
      position: absolute;
      font-size: 16px;
      color: gold;
      font-weight: 500;
      top: 0;
      z-index: 99999;

      &:nth-child(1) {
        left: 2%;
      }
      &:nth-child(3) {
        right: 2%;
      }
    }

    .Jxd {
      height: 38px;
      line-height: 38px;
      display: flex;
      color: rgb(251, 238, 191);
      background-color: rgba(0, 0, 0, 0.1);
      margin-bottom: 5px;
      z-index: 999;
    }

    .gameButton {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      list-style-type: none;

      li {
        &:nth-child(3) {
          width: 250px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .el-button--warning {
        font-size: 20px;
        border-radius: 999px;
        letter-spacing: 2px;
        box-shadow: 0px 0px 5px #ccc;
      }

      .el-button--success {
        font-size: 20px;
        border-radius: 999px;
        letter-spacing: 2px;
        box-shadow: 0px 0px 5px #ccc;
      }
    }

    .poker {
      width: 100%;

      .rear {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .playerPoker {
        position: relative;
        width: 100%;
        .countDown {
          position: absolute;
          color: #000;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .left {
          position: fixed;
          left: 10%;
          top: 30%;

          li {
            margin-top: -78px;
          }

          .leftLastPoker {
            position: absolute;
            left: 130px;
            top: 40%;
            display: flex;

            li {
              margin-left: -38px;
            }
          }
        }

        .me {
          position: fixed;
          left: 50%;
          bottom: 10%;
          display: flex;
          transform: translateX(-50%);
          width: 70%;
          justify-content: center;
          flex-wrap: nowrap;
          
          li {
            margin-left: 0;
            transition: all 0.3s ease;
            position: relative;
            flex-shrink: 0;
            margin: 0 -20px;
            list-style-type: none;
            &.active {
              transform: translateY(-20px);
            }

            img {
              width: 80px;
              height: auto;
              display: block;
            }
          }
        }

        .right {
          position: fixed;
          right: 10%;
          top: 30%;

          li {
            margin-top: -78px;
          }

          .rightLastPoker {
            position: absolute;
            right: 80px;
            top: 40%;
            display: flex;

            li {
              margin-left: -38px;
            }
          }
        }

        .lord {
          position: fixed;
          top: 8%;
          left: 50%;
          display: flex;
          transform: translateX(-50%);
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.5);

          li {
            list-style: none;
          }
        }

        .middle {
          position: fixed;
          top: 50%;
          left: 50%;
          display: flex;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  /deep/.gameSettle {
    z-index: 9999;
  }

  /deep/.victoryBanner {
    z-index: 999999;
  }

  /deep/.el-dialog__body {
    padding: 0;
  }

  /deep/.el-dialog {
    border-radius: 10px;
    width: 640px;
  }

  /deep/.el-dialog__header {
    padding: 0;
  }
  li{
    list-style-type: none!important;
  }
  // 移动端特定样式
  .mobile-menu {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
  }

  .alarm {
    transform: scale(0.8);
  }

  .countDown {
    font-size: 14px;
  }

  [v-click-sound] {
    cursor: pointer;
    touch-action: manipulation;
  }

  .active {
    transition: transform 0.2s ease;
  }

  @keyframes alarmMove {
    0%, 100% {
      transform: rotate(0) scale(0.8);
    }
    25% {
      transform: rotate(-30deg) scale(0.8);
    }
    75% {
      transform: rotate(30deg) scale(0.8);
    }
  }
}
// 媒体查询
@media screen and (max-width: 768px) {
  .pokerRoom {
    min-height: 100vh !important;

    .pokerRoom-header {
      height: 2.5rem;

      .operation {
        width: 105px;
      }
    }

    .pokerRoom-box {
      height: calc(100% - 2.5rem);

      .avatarImg {
        width: 40px;
        height: 40px;
      }

      .me {
        left: 0;
        bottom: 1%;
        img {
          width: 40px;
        }

        .button1, .button2 {
          width: 80px;
          height: 30px;
          font-size: 14px;
        }
      }

      .others {
        &:nth-child(1) {
          left: 5px;
          bottom: 60%;
        }

        &:nth-child(3) {
          right: 5px;
          bottom: 60%;
        }
      }

      .poker {
        .playerPoker {
          .left{
            top:44%;
            li{
              margin-top: -90px;
            }
          }
          .me {
            position: fixed;
            left: 50%;
            bottom: 16%;
            transform: translateX(-50%);
            width: 90vw;
            height: 80px;
            display: flex;
            align-items: flex-end;
            li {
              margin-left: -12px;
              z-index: 12;
              img {
                width: 50px;
                height: auto;
                display: block;
              }
              &.active {
                z-index: 13;
                transform: translateY(-20px);
              }
            }
          }
          .right{
            top:44%;
            li{
              margin-top: -90px;
            }
          }
          .lord{
            img{
              width:50px
            }
          }
        }
      }

      .gameButton {
        li {
          img {
            width: 120px;
          }
        }

        .el-button {
          font-size: 16px;
          padding: 8px 15px;
        }
      }

      .Jxd {
        height: 30px;
        line-height: 30px;
        margin-bottom: 3px;
        
        img {
          width: 30px;
          height: 30px;
        }
        
        span {
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
