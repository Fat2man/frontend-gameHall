<template>
  <div class="home">
    <el-container>
      <el-header>
        <span class="title">欢迎来到专业在线聊天室</span>
        <p class="roomInfo">💃 在线：715人 <span class="exit" @click="logout">安全退出</span></p>

        <span></span
      ></el-header>
      <el-container>
        <el-aside width="350px">
          <div class="userInfo">
            <div class="avatar">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" :size="70" :fit="fit"></el-avatar>
            </div>
          </div>
        </el-aside>
        <el-main>
          <div class="chat-box">xxx</div>
          <div class="Message">oooo</div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    logout() {
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
.home {
  height: 100vh;
  background-color: #b1dced;
}
.el-aside {
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  text-align: center;
  line-height: calc(100vh - 170px);
  margin: 20px 30px 50px 80px;
}
.el-main {
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  margin: 20px 80px 50px 0px;
}
.chat-box {
  height: calc(100% - 130px);
}
.Message {
  height: 130px;
}
.el-header {
  background-color: rgba(255, 255, 255, 0.5) !important;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.title {
  font-size: 20px;
  font-weight: 600;
}
.userInfo {
}
.roomInfo {
  position: absolute;
  display: flex;
  top: 0px;
  right: 85px;
  font-size: 14px;
  font-weight: 500;
  font-family: ZhuZiAWan_light;
}
.exit {
  cursor: pointer;
  margin-left: 15px;
}
</style>
