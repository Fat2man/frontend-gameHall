<template>
  <div class="home">
    <Header v-if="!isMobile"></Header>
    <div class="box">
      <div class="mobile-user-trigger" v-if="isMobile">
        <div class="trigger-button" @click="toggleUserList">
          <div class="user-badge">
            <i class="el-icon-user"></i>
            <span class="user-count">{{ Object.keys(userList).length }}</span>
          </div>
        </div>
      </div>
      <div
        class="aside"
        :class="{ 'mobile-aside': isMobile, 'show': showUserList }"
        v-show="!isMobile || showUserList"
      >
        <div class="mobile-header" v-if="isMobile">
          <span>在线用户: ({{ Object.keys(userList).length }})</span>
          <i class="el-icon-close" @click="toggleUserList"></i>
        </div>
        <div class="userInfo">
          <div
            class="userInfo-title"
            v-if="!isMobile"
          >用户列表 &nbsp; 💃 在线：{{ Object.keys(userList).length }}人</div>
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
            v-if="tooltipShow"
            class="item"
            effect="light"
            content="不能发送空白文字"
            placement="top-start"
            :value="tooltipShow"
          >
            <button
              @click.stop="send"
              class="button"
              :class="buttonActive ? 'activeButton' : ''"
              @mousedown="changeColor"
              @mouseup="resetColor"
            >发送(S)</button>
          </el-tooltip>
          <button
            v-else
            @click.stop="send"
            class="button"
            :class="buttonActive ? 'activeButton' : ''"
            @mousedown="changeColor"
            @mouseup="resetColor"
          >发送(S)</button>
          <VEmojiPicker
            v-show="showDialog"
            class="emojiPicker"
            labelSearch="Search"
            lang="pt-BR"
            @select="onSelectEmoji"
          />
        </div>
        <el-dialog :visible.sync="dialogImage" width="600px" :append-to-body="true">
          <img :src="previewImgUrl" alt style="width:500px;height:500px; object-fit:scale-down" />
        </el-dialog>
      </div>
    </div>
    <div
      class="mobile-mask"
      :class="{ 'show': showUserList }"
      v-if="isMobile"
      @click="toggleUserList"
    ></div>
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
      dialogImage: false,
      isMobile: false,
      showUserList: true,
      keyboardHeight: 0,
      originalViewportHeight: 0
    };
  },
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
    moveCursorToEnd() {
      const input = this.$refs.textInput;
      input.focus(); // 确保输入框聚焦
      // 创建一个新的 Range 对象，并将光标移动到末尾
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      // 清除任何现有的选择并应用新范围
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    },
    onSelectEmoji(emoji) {
      if (this.$refs.textInput) {
        this.$refs.textInput.innerHTML += emoji.data;
        this.showDialog = false;
        if (this.isMobile) {
          this.$nextTick(() => {
            this.moveCursorToEnd();
          });
        }
      }
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
      if (this.showDialog && this.isMobile) {
        document.body.style.overflow = "hidden";
        this.$refs.textInput?.blur();
        document.body.addEventListener("touchmove", this.preventDefault, {
          passive: false
        });
      } else {
        document.body.style.overflow = "";
        this.$refs.textInput?.focus();
        document.body.removeEventListener("touchmove", this.preventDefault);
      }
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
      this.message = this.$refs.textInput.innerHTML.replace(/<br>/g, "");
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
      setTimeout(() => {
        if (!this.keyboardHeight) {
          this.handleVisualViewportResize();
        }
      }, 300);
    },
    checkStatus() {
      this.$AXIOS("my/userinfo", "get", {}).then(res => {
        console.log("身份认证成功");
      });
    },
    toggleUserList() {
      this.showUserList = !this.showUserList;
      if (this.showUserList) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.showUserList = false;
        document.body.style.overflow = "";
      }
    },
    handleVisualViewportResize() {
      if (this.isMobile) {
        const viewport = window.visualViewport;
        const chatBox = this.$refs.chatBox;

        if (!this.originalViewportHeight) {
          this.originalViewportHeight = viewport.height;
        }
        this.initializeLayout();
        if (chatBox) {
          this.keyboardHeight = Math.max(
            0,
            this.originalViewportHeight - viewport.height
          );

          const mainElement = chatBox.closest(".main");
          if (mainElement) {
            if (this.keyboardHeight > 0) {
              mainElement.style.height = `${viewport.height - 60}px`;
              chatBox.style.height = `${viewport.height - 160}px`;
            } else {
              mainElement.style.height = "";
              chatBox.style.height = "";
            }
          }

          setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
          }, 100);
        }
      }
    },
    initializeLayout() {
      if (this.isMobile && this.$refs.chatBox) {
        const mainElement = this.$refs.chatBox.closest(".main");
        if (mainElement) {
          const viewport = window.visualViewport || window;
          mainElement.style.height = `${viewport.height - 60}px`;
          this.$refs.chatBox.style.height = `${viewport.height - 160}px`;
        }
      }
    },
    preventDefault(e) {
      e.preventDefault();
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
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        this.handleVisualViewportResize
      );
      window.visualViewport.addEventListener(
        "scroll",
        this.handleVisualViewportResize
      );
    }
    this.$nextTick(() => {
      this.initializeLayout();
    });
  },
  beforeDestroy() {
    this.socket.disconnect(() => {});
    window.removeEventListener("resize", this.checkMobile);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener(
        "resize",
        this.handleVisualViewportResize
      );
      window.visualViewport.removeEventListener(
        "scroll",
        this.handleVisualViewportResize
      );
    }
    document.body.removeEventListener("touchmove", this.preventDefault);
  }
};
</script>
<style scoped lang="stylus">
.home
  height 100vh
  background linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)
  min-width 320px
  min-height 555px
  position relative
  .box
    display flex
    justify-content space-evenly
    padding 0 5%
    margin-top 2%
    height calc(100vh - 170px)
    min-height 385px
    @media screen and (max-width 768px)
      flex-direction column
      padding 0 10px
      margin-top 10px
      height auto
    .aside
      background rgba(255, 255, 255, 0.95)
      border-radius 12px
      box-shadow 0 8px 32px rgba(31, 38, 135, 0.15)
      backdrop-filter blur(4px)
      width 25%
      color #333
      min-width 250px
      @media screen and (max-width 768px)
        width 100%
        min-width auto
        margin-bottom 10px
        max-height 200px
        overflow-y auto
        flex-shrink 0
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
          background rgba(0, 0, 0, 0.03)
          font-weight 600
        .userInfo-box
          text-align left
          .avatarImg
            width 30px
            height 30px
            object-fit cover
            border-radius 5px
          .userOne
            height 30px
            line-height 30px
            list-style none
            text-decoration none !important
            margin 8px
            box-shadow 0px 0px 5px #ccc
            border-radius 5px
            display flex
            padding 5px
            span
              display block
              line-height 30px
              margin-left 15px
              font-size 14px
            transition all 0.3s ease
            background rgba(255, 255, 255, 0.8)
            border 1px solid rgba(0, 0, 0, 0.05)
            &:hover
              transform translateY(-2px)
              box-shadow 0 5px 15px rgba(0, 0, 0, 0.1)
            .avatarImg
              border-radius 50%
              border 2px solid #fff
              box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
    .main
      background rgba(255, 255, 255, 0.95)
      border-radius 12px
      box-shadow 0 8px 32px rgba(31, 38, 135, 0.15)
      backdrop-filter blur(4px)
      color #333
      width 45%
      @media screen and (max-width 768px)
        width 100%
        height calc(100vh - 340px)
        min-height 300px
        max-height calc(100vh - 240px)
        flex 1
        display flex
        flex-direction column
        transition height 0.3s ease
        position relative
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
              background rgba(0, 0, 0, 0.1)
              padding 5px 15px
              border-radius 15px
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
              background linear-gradient(135deg, #00b09b, #96c93d)
              color white
              border-radius 18px 18px 0 18px
              box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
              span
                display inline-block
                word-break break-all
            .userMsg2
              display inline-block
              max-width 55%
              padding 10px
              background white
              border-radius 18px 18px 18px 0
              box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
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
        @media screen and (max-width 768px)
          height auto
          min-height 100px
          padding-bottom 50px
          margin-top auto
        .option
          position absolute
          z-index 999
          .option-icon
            margin 0 10px
            cursor pointer
            transition all 0.3s ease
            &:hover
              color #2a5298
              transform scale(1.1)
        .button
          position absolute
          right 20px
          bottom 15px
          width 100px
          height 30px
          border 0px solid transparent
          background linear-gradient(135deg, #00b09b, #96c93d)
          color white
          font-weight 600
          transition all 0.3s ease
          &:hover
            transform translateY(-2px)
            box-shadow 0 5px 15px rgba(0, 0, 0, 0.2)
        .activeButton
          background-color rgb(198, 198, 198) !important
        #textInput
          height 125px
          width 100%
          background rgba(255, 255, 255, 0.8) !important
          border-radius 8px
          box-shadow inset 0 2px 4px rgba(0, 0, 0, 0.05)
          border none
          outline none
          padding-left 10px
          padding-top 20px
          box-sizing border-box
          overflow-y auto
          text-align left
          position relative
          @media screen and (max-width 768px)
            height 75px
            padding-bottom 10px
        .emojiPicker
          position absolute
          height 450px
          width 400px
          top -460px
          left -210px
          @media screen and (max-width 768px)
            position fixed
            top 50%
            left 50%
            transform translate(-50%, -50%)
            width 90vw
            max-width 400px
            height 60vh
            max-height 450px
            z-index 1002
            overflow-y auto
            border-radius 12px
            box-shadow 0 4px 12px rgba(0, 0, 0, 0.15)
            touch-action none
            -webkit-tap-highlight-color transparent
            user-select none
            :deep(.emoji-picker)
              touch-action none
            :deep(button)
              touch-action manipulation
              -webkit-tap-highlight-color transparent
              user-select none
              min-width 44px
              min-height 44px
              padding 10px
    .mobile-user-trigger
      position fixed
      top 20px
      right 40px
      z-index 1000
      .trigger-button
        width 30px
        height 30px
        background linear-gradient(135deg, #ff4757, #ff6b81)
        border-radius 50%
        display flex
        align-items center
        justify-content center
        box-shadow 0 4px 15px rgba(255, 71, 87, 0.3)
        cursor pointer
        transition all 0.3s ease
        &:hover
          transform scale(1.05)
        .user-badge
          position relative
          display flex
          align-items center
          justify-content center
          i
            font-size 28px
            color white
          .user-count
            position absolute
            top 5px
            right -23px
            background #2a5298
            color white
            border-radius 50%
            width 15px
            height 15px
            line-height 15px
            text-align center
            font-size 14px
            font-weight bold
            box-shadow 0 2px 8px rgba(0, 0, 0, 0.2)
            border 2px solid white
      .aside
        &.mobile-aside
          position fixed
          top 0
          right 0
          height 100vh
          width 80%
          max-width 300px
          z-index 1001
          transform translateX(100%)
          transition transform 0.3s ease
          margin 0
          &.show
            transform translateX(0)
          .mobile-header
            display flex
            justify-content space-between
            align-items center
            padding 15px 20px
            background linear-gradient(135deg, #ff4757, #ff6b81)
            color white
            font-size 18px
            font-weight bold
            i
              font-size 24px
              cursor pointer
              transition all 0.3s ease
              &:hover
                transform rotate(90deg)
      .mobile-mask
        display none
        position fixed
        top 0
        left 0
        right 0
        bottom 0
        background rgba(0, 0, 0, 0.5)
        z-index 1000
        opacity 0
        transition opacity 0.3s ease
        &.show
          display block
          opacity 1
</style>
