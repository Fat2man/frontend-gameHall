<template>
  <div class="home">
    <Header></Header>
    <div class="box">
      <div class="aside">
        <div class="userInfo">
          <div class="userInfo-title">用户列表 &nbsp; 💃 在线：{{ Object.keys(userList).length }}人</div>
          <ul class="userInfo-box">
            <li class="userOne" v-for="(item,index) in userList" :index="item.username">
              <img :src="item.user_pic" class="avatarImg" />
              <span>{{item.username}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="main">
        <div class="chat-box" ref="chatBox">
          <ul>
            <li
              v-for="(item, index) in messageArr"
              :key="index"
              :style="`text-align:${item.username === 'systemMsg' ? 'center' : item.username === userInfo.username ? 'right' : 'left'}`"
            >
              <span v-if="item.username === 'systemMsg'" class="systemMsg">{{ item.msg }}</span>
              <div
                v-else
                :style="`display:flex;position:relative;${item.username === userInfo.username ? 'justify-content:flex-end' :'justify-content:flex-start'}`"
              >
                <img
                  v-if="item.username !== userInfo.username"
                  :src="item.user_pic"
                  alt
                  class="img1"
                  style="margin-right:5px;"
                />
                <span
                  v-if="item.username !== userInfo.username"
                  class="othersName"
                >{{item.username}}</span>
                <span :class="item.username === userInfo.username ? 'userMsg1' : 'userMsg2'">
                  <img
                    v-if="item.file"
                    :src="item.file"
                    width="100px"
                    style="cursor:pointer"
                    @click="previewImage(item.file)"
                  />
                  <span v-else v-html="item.msg"></span>
                </span>
                <img
                  v-if="item.username === userInfo.username"
                  :src="item.user_pic"
                  alt
                  class="img1"
                  style="margin-left:5px"
                />
              </div>
            </li>
          </ul>
        </div>
        <div class="Message">
          <div class="option">
            <i class="iconfont option-icon" @click="toogleDialogEmoji" id="face">&#xe625;</i>
            <input type="file" @change="changeFile" ref="File" accept="image/*" v-show="false" />
            <i class="el-icon-folder option-icon" @click="sendFolder"></i>
            <i class="el-icon-scissors option-icon" @click="scissorsClick"></i>
          </div>
          <div @keyup.enter="send" id="textInput" contenteditable autofocus ref="textInput"></div>
          <el-tooltip
            class="item"
            effect="light"
            content="不能发送空白文字"
            placement="top-start"
            :value="tooltipShow"
          >
            <button
              @click="send"
              class="button"
              :class="buttonActive ? 'activeButton' : ''"
              @mousedown="changeColor"
              @mouseup="resetColor"
            >发送(S)</button>
          </el-tooltip>
          <VEmojiPicker
            v-show="showDialog"
            class="emojiPicker"
            labelSearch="Search"
            lang="pt-BR"
            @select="onSelectEmoji"
          />
        </div>
        <el-dialog :visible.sync="dialogImage" width="600px">
          <img :src="previewImgUrl" alt style="width:500px;height:500px; object-fit:scale-down" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import SocketIO from "socket.io-client";
import ScreenShot from "js-web-screen-shot";
import Header from "../../components/header.vue";
import { VEmojiPicker } from "v-emoji-picker";
export default {
  name: "home",
  components: {
    VEmojiPicker,
    Header
  },
  data() {
    return {
      message: "",
      socket: "",
      messageArr: [],
      userList: [],
      userInfo: {},
      buttonActive: false,
      tooltipShow: false,
      showDialog: false,
      emoji: "",
      previewImgUrl: "",
      dialogImage: false
    };
  },
  computed: {},
  methods: {
    previewImage(imgUrl) {
      this.previewImgUrl = imgUrl;
      this.dialogImage = true;
    },
    scissorsClick() {
      new ScreenShot({
        completeCallback: ({ base64, cutInfo }) => {
          //截图确认的回调
          this.$refs.textInput.innerHTML += `<img src="${base64}" style="width:150px;object-fit:contain"></img>`;
        }
      });
    },
    onSelectEmoji(emoji) {
      this.$refs.textInput.innerHTML += emoji.data;
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
    changeFile() {
      const fs = new FileReader();
      fs.readAsDataURL(this.$refs.File.files[0]);
      fs.onload = () => {
        this.socket.emit("sendFile", {
          username: this.userInfo.username,
          user_pic: this.userInfo.user_pic,
          file: fs.result
        });
      };
    },
    sendFolder() {
      // 发送文件
      this.$refs.File.click(); //打开上传文件弹框
    },
    changeColor() {
      this.buttonActive = true;
    },
    resetColor() {
      this.buttonActive = false;
    },
    send() {
      this.message = this.$refs.textInput.innerHTML;
      console.log(this.$refs.textInput.innerHTML, "this.$refs.textInput.value");
      if (this.message === "") {
        this.tooltipShow = true;
        setTimeout(() => {
          this.tooltipShow = false;
        }, 2000);
        return;
      }
      this.tooltipShow = false;
      this.socket.emit("send", {
        msg: this.message,
        username: this.userInfo.username,
        user_pic: this.userInfo.user_pic
      });
      this.$refs.textInput.innerHTML = "";
    },
    checkStatus() {
      this.$AXIOS("my/userinfo", "get", {}).then(res => {
        console.log("身份认证成功");
      });
    }
  },
  created() {
    this.checkStatus();
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.socket = new SocketIO(this.$basrUrl);
    this.socket.emit("username", {
      username: this.userInfo.username,
      user_pic: this.userInfo.user_pic
    });
    this.socket.on("usersList", data => {
      console.log("usersList", data);
      this.userList = data;
    });
    this.socket.on("news", data => {
      this.messageArr.push(data);
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop =
          this.$refs.chatBox.scrollHeight - this.$refs.chatBox.offsetHeight;
      });
    });
    this.emoji = document.querySelector(".emojiPicker");
    document.addEventListener("mousedown", e => {
      //给整个文档点击鼠标按钮事件，如果点击区域为表情包区域之外，则关闭表情包显示框
      if (!this.emoji.contains(e.toElement)) {
        this.showDialog = false;
      }
    });
  },
  beforeDestroy() {
    this.socket.disconnect(() => {});
  }
};
</script>
<style scoped lang="stylus">
.home
  height 100vh
  background-color #b1dced
  min-width 750px
  min-height 555px
  .box
    display flex
    justify-content space-evenly
    padding 0 5%
    margin-top 2%
    height calc(100vh - 170px)
    min-height 385px
    .aside
      background-color rgb(245, 245, 245)
      width 25%
      color #333
      min-width 250px
      .userInfo
        height 100%
        overflow-y auto
        &::-webkit-scrollbar
          width 5px /* 修改宽度 */
        &::-webkit-scrollbar-thumb
          border-radius 5px
          background-color transparent
        &:hover::-webkit-scrollbar-thumb
          background-color #ccc
        .userInfo-title
          font-size 16px
          text-align left
          padding-left 20px
          color #000
          border-bottom 1px solid #CCC
          height 50px
          line-height 50px
        .userInfo-box
          text-align left
          .avatarImg
            width 40px
            height 40px
            object-fit cover
            border-radius 5px
          .userOne
            height 40px
            line-height 40px
            list-style none
            text-decoration none !important
            margin 15px
            box-shadow 0px 0px 5px #ccc
            border-radius 5px
            display flex
            padding 10px
            span
              display block
              line-height 40px
              margin-left 25px
    .main
      background-color rgb(245, 245, 245)
      color #333
      width 45%
      .chat-box
        box-sizing border-box
        height calc(100% - 130px)
        padding 10px
        overflow-y auto
        &::-webkit-scrollbar
          width 5px /* 修改宽度 */
        &::-webkit-scrollbar-thumb
          border-radius 5px
          background-color transparent
        ul
          li
            list-style-type none
            margin 10px 0
            .systemMsg
              font-size 12px
              color darkgrey
              text-align center
            .img1
              height 40px
              width 40px
              border-radius 5%
              object-fit cover
            .othersName
              position absolute
              color #cccccc
              font-size 12px
              left 47px
              top -7px
            .userMsg1
              display inline-block
              max-width 55%
              padding 10px
              background-color rgb(149, 236, 105)
              border-radius 5px
              text-align left
              span
                display inline-block
                word-break break-all
            .userMsg2
              display inline-block
              max-width 55%
              padding 10px
              background-color #fff
              border-radius 5px
              text-align left
              margin-top 10px
              span
                display inline-block
                word-break break-all
      .chat-box:hover::-webkit-scrollbar
        width 5px
      .chat-box:hover::-webkit-scrollbar-thumb
        background-color #ccc
      .Message
        box-sizing border-box
        height 130px
        border-top 1px solid rgba(204, 204, 204, 0.5)
        position relative
        .option
          position absolute
          .option-icon
            margin 0 10px
            cursor pointer
        .button
          position absolute
          right 20px
          bottom 15px
          width 100px
          height 30px
          border 0px solid transparent
          background-color rgb(233, 233, 233)
          border-radius 5px
          cursor pointer
          color rgb(7, 193, 96)
          font-size 14px
          z-index 999
          &:hover
            background-color rgb(210, 210, 210)
        .activeButton
          background-color rgb(198, 198, 198) !important
        #textInput
          height 73px
          width 100%
          background-color rgb(245, 245, 245) !important
          border 0px
          outline none
          box-sizing border-box
          margin-top 20px
          padding-left 10px
          overflow-y auto
          text-align left
        .emojiPicker
          position absolute
          height 450px
          width 400px
          top -460px
          left -210px
</style>
