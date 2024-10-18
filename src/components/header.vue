<template>
  <div class="header">
    <div class="header-left">江雪休闲大厅</div>
    <div class="header-right">
      <img :src="userInfo.user_pic" class="avatarImg" />
      <span>{{ userInfo.username }}</span>
      <span class="exit" @click="goIndex" v-click-sound>🏡 首页</span>
      <span class="exit" @click="logout" v-click-sound>安全退出</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "header",
  data() {
    return {
      userInfo: {}
    };
  },
  methods: {
    goIndex() {
      this.$router.push("/Index");
    },
    logout() {
      this.$router.push("/");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("mytoken");
    }
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  }
};
</script>

<style lang="stylus" scoped>
.header {
  height: 3.75rem;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 2%;
  line-height: 3.75rem;
  transition: background-color, box-shadow, 0.5s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
  }

  .header-left {
    font-size: 24px;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
    font-family: 'AlimamaFangYuanTiVF-Thin';
  }

  .header-right {
    .avatarImg {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 999px;
    }

    .exit {
      cursor: pointer;
      margin-left: 15px;
    }
  }
}
</style>