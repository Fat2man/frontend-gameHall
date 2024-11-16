<template>
  <div class="pokerHall">
    <audio ref="audio" src="~@/assets/music/pokerBgm.ogg" autoplay loop></audio>
    <div class="pokerHall-header">
      <Header v-if="!isMobile"></Header>
      <div class="title">
        <h3 class="h22">多人斗地主大厅</h3>
        <p class="tips">组队建房开始游戏吧</p>
      </div>
    </div>
    <div class="pokerHall-box">
      <div class="pokerHall-box-left">
        <button class="button-3d-1" @click="createRoom" v-click-sound>创建房间</button>
        <button class="button-3d-2" @click="quickMatch" v-click-sound>快速匹配</button>
      </div>
      <div class="pokerHall-box-right">
        <div
          class="roomOne"
          v-for="(room,key,index) in roomList"
          :key="index"
          @click="joinRoom(key)"
        >
          <img src="~@/assets/desk.jpeg" height="130px" class="desk" />
          <p class="roomTitle">{{key}}</p>
          <li v-for="item in room" :key="item.userName">
            <span>
              <img :src="item.user_pic" alt="人物头像" class="avatar" />
            </span>
            <span>{{item.userName}}</span>
          </li>
        </div>
      </div>
    </div>
    <el-dialog
      title="创建房间"
      :visible.sync="dialogCreateRoom"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="createForm"
        :rules="rulesCreate"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="createForm.roomName"></el-input>
        </el-form-item>
        <el-form-item label="房间密码">
          <el-input v-model="createForm.roomPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogCreateRoom = false" v-click-sound>取 消</el-button>
        <el-button type="success" @click="saveCreate" v-click-sound>确 定</el-button>
      </span>
    </el-dialog>
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
        roomName: "",
        roomPwd: ""
      },

      rulesCreate: {
        roomName: [
          { required: true, message: "房间名称不能为空！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    joinRoom(roomName) {
      if (Object.keys(this.roomList[roomName]).length === 3)
        return this.$message.warning("房间人数已满！");
      this.$prompt("<strong>请输入房间密码</strong>", "提示", {
        confirmButtonText: "确定",
        roundButton: true,
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      })
        .then(({ value }) => {
          let roomInfo = {
            roomName: roomName,
            roomPwd: value,
            userName: this.user.username,
            user_pic: this.user.user_pic,
            score: this.user.score
          };
          this.socket.emit("creatRoom", roomInfo);
        })
        .catch(() => {});
    },
    saveCreate() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let roomInfo = {
            roomName: this.createForm.roomName,
            roomPwd: this.createForm.roomPwd,
            userName: this.user.username,
            user_pic: this.user.user_pic,
            score: this.user.score
          };
          this.socket.emit("creatRoom", roomInfo);
        }
      });
    },
    createRoom() {
      this.createForm = {};
      this.dialogCreateRoom = true;
    },
    quickMatch() {}
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
      console.log(message, "message");
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
  height 100%
  background url('~@/assets/pokerHallBg.png') left bottom / 100% 100% no-repeat
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
          height 100%
          object-fit cover
          border-radius 15px
          box-shadow 0 5px 15px rgba(0, 0, 0, 0.3)
        .roomTitle
          position absolute
          left 54%
          top 50%
          color #fff
          font-size 14px
          font-weight bold
          text-shadow 2px 2px 4px rgba(0, 0, 0, 0.5)
          background rgba(0, 0, 0, 0.6)
          padding 5px 15px
          border-radius 20px
          transform translate(-50%, -50%)
        li
          position absolute
          transition all 0.3s ease
          .avatar
            width 50px
            height 50px
            border-radius 50%
            border 3px solid #fff
            box-shadow 0 2px 8px rgba(0, 0, 0, 0.2)
          &:nth-of-type(1)
            bottom -15px
            left 55%
            transform translateX(-50%)
          &:nth-of-type(2)
            top 50%
            left -15px
            transform translateY(-50%)
          &:nth-of-type(3)
            top 50%
            right -15px
            transform translateY(-50%)
>>>.el-dialog
  background url('~@/assets/dialogBg.png') center / cover
  .el-dialog__header
    padding 10px
    .el-dialog__title
      color #ffffff
  .el-form-item__label
    color #ffffff
</style>