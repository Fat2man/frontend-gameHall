<template>
  <div class="victory-banner">
    <div class="header">
      <div class="title">牌圣</div>
      <div class="subtitle">太酷啦! So cool</div>
    </div>
    <div class="content">
      <div class="streak-message">
        我已连胜
        <span class="streak">{{ winStreak }}局了!</span>
      </div>
      <div class="footer">
        <div class="user-info">
          <img :src="avatar" alt="用户头像" class="avatar" />
          <div>
            <span class="nickname">{{ nickname }}</span>
            <div class="description">好运来，我们好运来</div>
          </div>
        </div>
        <div class="game-info">
          <img src="~@/assets/hall_logo_pic.png" alt="游戏logo" class="game-logo" />
          <div class="qr-code">
            <img src="~@/assets/victory.png" alt="二维码" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    winStreak: {
      type: Number,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.victory-banner
  width 600px
  padding 20px
  background-color #ffffff
  border-radius 10px
  box-shadow 0 4px 10px rgba(0, 0, 0, 0.1)
  display flex
  flex-direction column
  align-items center
  text-align center
.header
  margin-bottom 10px
.title
  font-size 24px
  font-weight bold
  color #ff6a00
.subtitle
  font-size 18px
  color #ff6a00
.content
  margin-bottom 20px
  width 100%
.streak-message
  font-size 20px
  font-weight bold
  color #ff4500
.footer
  display flex
  justify-content space-around
.streak
  font-size 24px
  color #ff0000
.user-info
  display flex
  flex-direction row
  align-items center
  margin-top 10px
  text-align left
.avatar
  width 40px
  height 40px
  border-radius 50%
  margin-right 10px
.nickname
  font-size 18px
  font-weight bold
  color #333
  text-align left
.description
  margin-top 10px
  font-size 16px
  color #666
.game-info
  display flex
  flex-direction row
  justify-content space-between
  align-items center
.game-logo
  width 120px
  height auto
.qr-code
  width 100px
  img
    width 100%
    height auto
</style>
