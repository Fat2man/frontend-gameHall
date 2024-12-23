<template>
  <div class="pokerHall">
    <audio ref="audio" src="~@/assets/music/pokerBgm.ogg" autoplay loop></audio>
    <div class="pokerHall-header">
      <Header v-if="!isMobile"></Header>
      <div class="mobile-header" v-if="isMobile">
        <i class="el-icon-arrow-left" @click="goBack"></i>
        <span>斗地主大厅</span>
      </div>
      <div class="title" v-if="!isMobile">
        <h3 class="h22">多人斗地主大厅</h3>
        <p class="tips">组队建房开始游戏吧</p>
      </div>
    </div>
    <div class="pokerHall-box">
      <!-- 移动端操作按钮 -->
      <div class="mobile-actions" v-if="isMobile">
        <button class="action-btn create" @click="createRoom" v-click-sound>
          <i class="el-icon-plus"></i>
          创建房间
        </button>
        <button class="action-btn quick" @click="quickMatch" v-click-sound>
          <i class="el-icon-video-play"></i>
          快速匹配
        </button>
      </div>
      <!-- PC端左侧按钮 -->
      <div class="pokerHall-box-left" v-if="!isMobile">
        <button class="button-3d-1" @click="createRoom" v-click-sound>创建房间</button>
        <button class="button-3d-2" @click="quickMatch" v-click-sound>快速匹配</button>
      </div>
      <!-- 房间列表 -->
      <div class="pokerHall-box-right" :class="{'mobile': isMobile}">
        <div
          class="roomOne"
          v-for="(room,key,index) in roomList"
          :key="index"
          @click="joinRoom(key)"
        >
          <img src="~@/assets/desk.jpeg" class="desk" />
          <p class="roomTitle">{{key}}</p>
          <div class="player-list">
            <div class="player" v-for="item in room" :key="item.userName">
              <img :src="item.user_pic" alt="头像" class="avatar" />
              <span class="name">{{item.userName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建房间弹窗 -->
    <el-dialog
      title="创建房间"
      :visible.sync="dialogCreateRoom"
      :width="isMobile ? '90%' : '400px'"
      :close-on-click-modal="false"
    >
      <el-form
        :model="createForm"
        :rules="rulesCreate"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="createForm.roomName"></el-input>
        </el-form-item>
        <el-form-item label="房间密码">
          <el-input v-model="createForm.roomPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateRoom = false" v-click-sound>取 消</el-button>
        <el-button type="primary" @click="saveCreate" v-click-sound>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加密码输入弹窗 -->
    <el-dialog
      title="加入房间"
      :visible.sync="joinRoomDialog"
      :width="isMobile ? '90%' : '400px'"
      :close-on-click-modal="false"
      custom-class="join-room-dialog"
    >
      <div class="join-room-content">
        <div class="room-info">
          <div class="room-thumbnail-wrapper">
            <img src="~@/assets/desk.jpeg" class="room-thumbnail" />
            <div class="glow-effect"></div>
          </div>
          <div class="room-details">
            <h3>{{selectedRoom}}</h3>
            <div class="room-status">
              <span class="player-count">
                <i class="el-icon-user"></i>
                {{Object.keys(roomList[selectedRoom] || {}).length}}/3
              </span>
              <span class="room-state" :class="{active: true}">
                <i class="el-icon-video-play"></i> 可加入
              </span>
            </div>
          </div>
        </div>
        <div class="password-input-wrapper">
          <el-input
            v-model="roomPassword"
            type="password"
            placeholder="请输入房间密码"
            prefix-icon="el-icon-lock"
            clearable
            @keyup.enter.native="confirmJoin"
          >
            <template slot="suffix">
              <i class="el-icon-key password-icon"></i>
            </template>
          </el-input>
          <div class="input-border"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="joinRoomDialog = false" v-click-sound class="cancel-btn">
          <i class="el-icon-close"></i> 取 消
        </el-button>
        <el-button type="primary" @click="confirmJoin" v-click-sound class="confirm-btn">
          <i class="el-icon-right"></i> 确 定
        </el-button>
      </span>
    </el-dialog>
    <CustomMessage message="nihaonihao"></CustomMessage>
  </div>
</template>

<script>
import SocketIO from "socket.io-client";
import Header from "../../components/header.vue";
export default {
  name: "pokerHall",
  components: {
    Header
  },
  data() {
    return {
      joinRoomDialog: false,
      roomList: {}, //房间列表
      user: {}, //用户信息
      socket: "",
      dialogCreateRoom: false, //创建房间dialog
      isMobile: false,
      createForm: {
        roomName: '',
        roomPwd: ''
      },

      rulesCreate: {
        roomName: [
          { required: true, message: "房间名称不能为空！", trigger: "blur" },
          { min: 1, max: 7, message: "房间名称长度在1-7个字符之间！", trigger: "blur" }
        ]
      },
      selectedRoom: '',
      roomPassword: '',
    };
  },
  methods: {
    joinRoom(roomName) {
      if (Object.keys(this.roomList[roomName]).length === 3)
        return this.$message.warning("房间人数已满！");
      this.selectedRoom = roomName;
      this.roomPassword = '';
      this.joinRoomDialog = true;
    },
    confirmJoin() {
      let roomInfo = {
        roomName: this.selectedRoom,
        roomPwd: this.roomPassword,
        userName: this.user.username,
        user_pic: this.user.user_pic,
        score: this.user.score
      };
      this.socket.emit("creatRoom", roomInfo);
      this.joinRoomDialog = false;
    },
    saveCreate() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let roomInfo = {
            roomName: this.createForm.roomName,
            roomPwd: this.createForm.roomPwd || '',
            userName: this.user.username,
            user_pic: this.user.user_pic,
            score: this.user.score
          };
          this.socket.emit("creatRoom", roomInfo);
        }
      });
    },
    createRoom() {
      this.createForm = {
        roomName:'',
        roomPwd:''
      };
      this.dialogCreateRoom = true;
    },
    quickMatch() {
      let playerInfo = {
        userName: this.user.username,
        user_pic: this.user.user_pic,
        score: this.user.score
      };
      this.socket.emit("quickMatch", playerInfo);
    },
    goBack() {
      this.$router.push('/Index')
    }
  },
  mounted() {
    this.socket = new SocketIO(this.$basrUrl);
    this.$store.commit("setSocket", { socket: this.socket }); //全局存储当前socket实例，方便其他页面使用
    this.socket.on("create-join-Room", rooms => {
      this.dialogCreateRoom = false;
      this.roomList = rooms;
    });
    this.socket.on("systemErr", message => {
      this.$message.warning(message);
    });
    this.socket.on("enterRoom", () => {
      this.$router.push("/pokerRoom");
    });
    this.user = JSON.parse(sessionStorage.getItem("userInfo"));
    this.$refs.audio.volume = 0.1;
    this.isMobile = window.innerWidth <= 768;
  }
};
</script>

<style scoped lang="stylus">
.pokerHall
  height 100vh
  background-color #1a237e
  @media screen and (max-width: 768px)
    background linear-gradient(135deg, rgba(26, 35, 126, 0.9), rgba(21, 101, 192, 0.9)), url('~@/assets/pokerHallBg.png') center / cover no-repeat fixed
    &:before
      content ''
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      background linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)
      pointer-events none
      z-index 1
    &:after
      content ''
      position fixed
      top -50%
      left -50%
      right -50%
      bottom -50%
      background radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)
      animation floating 15s infinite linear
      pointer-events none
      z-index 2
  
  @media screen and (min-width: 769px)
    background url('~@/assets/pokerHallBg.png') left bottom / cover no-repeat

.pokerHall-header
  background-color rgba(0, 0, 0, 0.5)
  box-shadow 0 1px 3px 0 rgba(0, 34, 77, 0.05)
  height 3.75rem
  .title
    margin-top -60px
    .h22
      color rgb(255, 241, 18)
      font-size 24px
      font-weight bolder
      letter-spacing 8px
      margin-bottom 5px
      text-shadow 0px 1px 3px rgb(255, 241, 18)
    .tips
      color #ffffff
      letter-spacing 5px

.pokerHall-box
  position relative
  z-index 3
  height calc(100vh - 3.75rem)
  width 100%
  display flex
  .pokerHall-box-left
    height 100%
    width 25%
    min-width 205px
    background-color rgba(1, 75, 67, 0.2)
    display flex
    flex-direction column
    justify-content space-around
    align-items center
    .button-3d-1
      position relative
      width 35%
      min-width 140px
      background orangered
      border none
      color white
      padding 15px 24px
      font-size 1.4rem
      outline none
      box-shadow -6px 6px 0 hsl(16, 100%, 30%)
      cursor url('~@/assets/sword.png'), auto !important
      &:before
        content ''
        display block
        width 0
        height 0
        position absolute
        top 0
        left -6px
        border 6px solid transparent
        border-right 6px solid hsl(16, 100%, 30%)
        border-left-width 0px
      &:after
        content ''
        display block
        width 0
        height 0
        position absolute
        bottom -6px
        right 0
        border 6px solid transparent
        border-top 6px solid hsl(16, 100%, 30%)
        border-bottom-width 0px
      &:active
        background hsl(16, 100%, 40%)
        top 3px
        left -3px
        box-shadow -3px 3px 0 hsl(16, 100%, 30%)
      &:active:before
        border 3px solid transparent
        border-right 3px solid hsl(16, 100%, 30%)
        border-left-width 0px
        left -3px
      &:active:after
        border 3px solid transparent
        border-top 3px solid hsl(16, 100%, 30%)
        border-bottom-width 0px
        bottom -3px
    .button-3d-2
      position relative
      width 35%
      min-width 140px
      background #00563f
      border none
      color white
      padding 15px 24px
      font-size 1.4rem
      outline none
      box-shadow -6px 6px 0 hsl(164, 100%, 10%)
      cursor url('~@/assets/sword.png'), auto !important
      &:before
        content ''
        display block
        width 0
        height 0
        position absolute
        top 0
        left -6px
        border 6px solid transparent
        border-right 6px solid hsl(164, 100%, 10%)
        border-left-width 0px
      &:after
        content ''
        display block
        width 0
        height 0
        position absolute
        bottom -6px
        right 0
        border 6px solid transparent
        border-top 6px solid hsl(164, 100%, 10%)
        border-bottom-width 0px
      &:active
        background hsl(164, 100%, 10%)
        top 3px
        left -3px
        box-shadow -3px 3px 0 hsl(164, 100%, 10%)
      &:active:before
        border 3px solid transparent
        border-right 3px solid hsl(164, 100%, 10%)
        border-left-width 0px
        left -3px
      &:active:after
        border 3px solid transparent
        border-top 3px solid hsl(164, 100%, 10%)
        border-bottom-width 0px
        bottom -3px

.mobile-header
  display flex
  align-items center
  padding 0 15px
  height 100%
  i
    font-size 24px
    color #fff
    margin-right 15px
  span
    color #fff
    font-size 18px
    font-weight 500
.mobile-actions
  position fixed
  bottom 20px
  left 0
  right 0
  display flex
  justify-content center
  gap 20px
  padding 0 20px
  z-index 10
  .action-btn
    flex 1
    max-width 160px
    padding 12px
    border-radius 8px
    border none
    color #fff
    font-size 16px
    display flex
    align-items center
    justify-content center
    gap 5px
    i
      font-size 20px
    &.create
      background linear-gradient(135deg, rgba(255, 71, 87, 0.9), rgba(255, 107, 129, 0.9))
    &.quick
      background linear-gradient(135deg, rgba(46, 213, 115, 0.9), rgba(123, 237, 159, 0.9))
.pokerHall-box-right
  height 100%
  width 75%
  display flex
  flex-wrap wrap
  justify-content center
  align-items center
  padding 4% 2%
  box-sizing border-box
  .roomOne
    width 180px
    height 180px
    margin 25px
    position relative
    transition all 0.3s ease
    cursor pointer
    &:hover
      transform scale(1.05)
    li
      list-style none
    .desk
      width 100%
      height 90%
      object-fit cover
      border-radius 15px
      box-shadow 0 5px 15px rgba(0, 0, 0, 0.3)
    .roomTitle
      position absolute
      left 53%
      top 50%
      color #fff
      font-size 14px
      font-weight bold
      text-shadow 2px 2px 4px rgba(0, 0, 0, 0.5)
      background rgba(0, 0, 0, 0.6)
      padding 5px 15px
      border-radius 20px
      transform translate(-50%, -50%)
    .player
      position absolute
      transition all 0.3s ease
      .avatar
        display block
        width 40px
        height 40px
        // border-radius 50%
        border 1px solid #fff
        box-shadow 0 2px 8px rgba(0, 0, 0, 0.2)
      &:nth-of-type(1)
        bottom 0px
        left 55%
        transform translateX(-50%)
      &:nth-of-type(2)
        top 55%
        left 8px
        transform translateY(-50%)
      &:nth-of-type(3)
        top 55%
        right -15px
        transform translateY(-50%)
  &.mobile
    width 100%
    padding 15px
    overflow-y auto
    display flex
    align-items flex-start
    justify-content flex-start
    .roomOne
      width 40%
      height 120px
      margin 15px
      background rgba(255, 255, 255, 0.1)
      backdrop-filter blur(10px)
      border-radius 12px
      border 1px solid rgba(255, 255, 255, 0.2)
      box-shadow 0 4px 15px rgba(0, 0, 0, 0.2)
      display flex
      align-items center
      position relative
      .desk
        width 100%
        height 100%
        object-fit cover
        border-radius 12px
        opacity 0.8
      .roomTitle
        position absolute
        left 52%
        top 0px
        transform translate(-50%, 0)
        font-size 14px
        border 1px solid rgba(255, 255, 255, 0.3)
        white-space nowrap
      .player-list
        position absolute
        width 100%
        height 100%
        .player
          position absolute
          .avatar
            display block
            width 35px
            height 35px
            border-radius 25%
            border 1px solid beige
            box-shadow 0 2px 8px rgba(0, 0, 0, 0.2)
          .name
            display none
          &:nth-child(1)  
            bottom 0
            left 52%
            transform translateX(-50%)
          &:nth-child(2)
            left 0
            top 50%
            transform translateY(-50%)
          &:nth-child(3)
            right 0
            top 50%
            transform translateY(-50%)
@keyframes floating
  0%
    transform translate(0, 0)
  25%
    transform translate(10%, 10%)
  50%
    transform translate(0, 15%)
  75%
    transform translate(-10%, 10%)
  100%
    transform translate(0, 0)
/deep/.el-dialog
  background url('~@/assets/dialogBg.png') center / cover
  .el-dialog__header
    padding 10px
    .el-dialog__title
      color #ffffff
  .el-form-item__label
    color #ffffff
.join-room-dialog
  /deep/.el-dialog
    transform scale(0.8)
    opacity 0
    transition all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
    background linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))
    backdrop-filter blur(10px)
    border 1px solid rgba(255,255,255,0.1)
    box-shadow 0 8px 32px rgba(0,0,0,0.1)    
    &.el-dialog--center
      transform scale(1)
      opacity 1    
  /deep/.el-dialog__header
    border-bottom 1px solid rgba(255,255,255,0.1)
    padding 15px 20px    
    .el-dialog__title
      background linear-gradient(45deg, #FFD700, #FFA500)
      -webkit-background-clip text
      -webkit-text-fill-color transparent
      font-weight bold   
  /deep/.el-dialog__body
    padding 25px  
  .join-room-content
    .room-info
      display flex
      align-items center
      margin-bottom 25px
      padding 15px
      background rgba(255,255,255,0.05)
      border-radius 12px
      transition transform 0.3s ease 
      &:hover
        transform translateY(-2px)
      .room-thumbnail-wrapper
        position relative
        margin-right 20px       
        .room-thumbnail
          width 80px
          height 80px
          border-radius 12px
          object-fit cover
          transition transform 0.3s ease         
          &:hover
            transform scale(1.05)      
        .glow-effect
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          border-radius 12px
          background radial-gradient(circle at 50% 50%, rgba(255,215,0,0.2), transparent)
          opacity 0
          transition opacity 0.3s ease
          pointer-events none         
          &:hover
            opacity 1
      .room-details
        flex 1 
        h3
          color #fff
          margin 0 0 10px 0
          font-size 20px
          text-shadow 0 2px 4px rgba(0,0,0,0.2)        
        .room-status
          display flex
          gap 15px        
          span
            display flex
            align-items center
            font-size 14px
            color rgba(255,255,255,0.8)
            i
              margin-right 5px
          .room-state
            &.active
              color #4CAF50     
    .password-input-wrapper
      position relative
      margin-bottom 20px
      .el-input
        /deep/.el-input__inner
          background rgba(255,255,255,0.1)
          border none
          height 45px
          font-size 16px
          color #fff
          padding 0 40px
          transition all 0.3s ease
          &:focus
            background rgba(255,255,255,0.15)
            box-shadow 0 0 0 2px rgba(255,241,18,0.2)
        /deep/.el-input__prefix
          left 15px
        .password-icon
          font-size 18px
          color rgba(255,255,255,0.6)
          animation rotateKey 2s infinite ease-in-out
          padding-top 12px
      .input-border
        position absolute
        bottom 0
        left 50%
        width 0
        height 2px
        background linear-gradient(90deg, #FFD700, #FFA500)
        transition width 0.3s ease, left 0.3s ease
      &:focus-within .input-border
        left 0
        width 100%
  .dialog-footer
    .el-button
      position relative
      overflow hidden
      transition all 0.3s ease
      &:before
        content ''
        position absolute
        top 50%
        left 50%
        width 0
        height 0
        background rgba(255,255,255,0.2)
        border-radius 50%
        transform translate(-50%, -50%)
        transition all 0.5s ease    
      &:hover:before
        width 300px
        height 300px
        opacity 0    
      &.confirm-btn
        background linear-gradient(45deg, #4CAF50, #45a049)
        border none  
      &.cancel-btn
        background rgba(255,255,255,0.1)
        border 1px solid rgba(255,255,255,0.2)
        &:hover
          background rgba(255,255,255,0.15)
@keyframes rotateKey
  0%
    transform rotate(0)
  25%
    transform rotate(-20deg)
  75%
    transform rotate(20deg)
  100%
    transform rotate(0)
@media screen and (max-width: 768px)
  .join-room-dialog
    .join-room-content
      .room-info
        flex-direction column
        text-align center
        .room-thumbnail-wrapper
          margin 0
        .room-status
          justify-content center
</style>