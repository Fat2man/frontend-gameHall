<template>
  <div class="index">
    <el-header height="80px" class="header">
      <div class="title-container">
        <h1 class="title">游戏大厅</h1>
        <el-button class="logout-btn" type="text" @click="handleLogout">
          <i class="el-icon-switch-button"></i> 退出
        </el-button>
      </div>
    </el-header>
    
    <el-container class="main-container">
      <el-aside width="350px" class="sidebar" v-show="!isMobile">
        <div class="dynamic-banner">
          <div class="banner-content">
            <div class="banner-animation"></div>
          </div>
        </div>
        <el-card class="welcome-card">
          <div slot="header" class="welcome-header">
            <span class="welcome-title">欢迎来到游戏大厅</span>
          </div>
          <div class="welcome-content">
            <p>这里有精彩的多人游戏和聊天室等着你。快来加入我们，开始你的游戏之旅吧！</p>
          </div>
        </el-card>
      </el-aside>
      
      <el-main class="game-container">
        <div class="game-grid">
          <div 
            v-for="(item, index) in gameArr" 
            :key="index"
            class="game-card"
            :class="{'game-card-landlord': item.name === '多人斗地主'}"
            @click="goGame(item.name)"
          >
            <div class="game-card-inner">
              <div class="game-icon">
                <i :class="item.icon"></i>
              </div>
              <h3 class="game-title">{{ item.name }}</h3>
              <div class="game-description">{{ item.description }}</div>
              <div class="game-players">
                <span class="online-dot"></span>
                {{ item.players }}人在线
              </div>
            </div>
            <div class="card-overlay"></div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { L2Dwidget } from "live2d-widget";
import Header from "../components/header.vue";
export default {
  name: "Index",
  components:{
    Header
  },
  data() {
    return {
      gameArr: [
        { 
          name: "多人斗地主", 
          icon: "el-icon-star-on",
          description: "经典棋牌游戏，随时开局",
          players: "1,234"
        },
        { 
          name: "聊天室", 
          icon: "el-icon-chat-dot-round",
          description: "畅聊交友，结识新伙伴",
          players: "856"
        }
      ],
      isMobile: false,
      windowWidth: window.innerWidth
    };
  },
  methods: {
    goGame(name) {
      if (name === "聊天室") {
        this.$router.push("/chatRoom");
      } else if (name === "多人斗地主") {
        this.$router.push("/pokerHall");
      }
    },
    handleLogout() {
      this.$router.push('/');
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.isMobile = window.innerWidth <= 768;
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    // 只在非移动端初始化 live2d
    if (!this.isMobile) {
      setTimeout(() => {
        L2Dwidget.init({
          model: {
            jsonPath: "https://cdn.jsdelivr.net/gh/wangsrGit119/wangsr-image-bucket/L2Dwidget/live2d-widget-model-haruto/assets/haruto.model.json"
          }
        });
      }, 1000);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    const widget = document.querySelector("#live2d-widget");
    if (widget) widget.remove();
  }
};
</script>

<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&display=swap')

.index
  min-height 100vh
  background linear-gradient(135deg, #1a1c2c 0%, #4a1942 50%, #893168 100%)
  overflow hidden
.header
  background linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))
  backdrop-filter blur(10px)
  border-bottom 1px solid rgba(255, 255, 255, 0.1)
  display flex
  justify-content center
  align-items center

.title-container
  position relative
  display flex
  justify-content center
  align-items center
  width 100%

  .logout-btn
    position absolute!important
    right 20px
    color #fff
    font-size 16px
    
    &:hover
      color #FFD700
      
    i
      margin-right 5px

.title
  font-family 'Noto Serif SC', serif
  font-size 36px
  font-weight 700
  color #fff
  text-shadow 0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5)
  margin 0
  padding 10px 30px
  background linear-gradient(45deg, #FFD700, #FFA500)
  -webkit-background-clip text
  -webkit-text-fill-color transparent
  animation titleGlow 2s ease-in-out infinite alternate
  @media (max-width: 768px)
    font-size 24px
    padding 5px 15px

.title-decoration
  position absolute
  top 50%
  width 100px
  height 2px
  background linear-gradient(to right, transparent, #FFD700, transparent)

  &.left
    left 0
    transform translateY(-50%) translateX(-120%)
  @media (max-width: 768px)
    width 60px
    
    &.left
      transform translateY(-50%) translateX(-80%)
    
    &.right
      right 0
      transform translateY(-50%) translateX(120%)
      transform translateY(-50%) translateX(80%)

@keyframes titleGlow
  from
    text-shadow 0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5)
  to
    text-shadow 0 0 15px rgba(255, 215, 0, 0.9), 0 0 30px rgba(255, 215, 0, 0.7)
    
.main-container
  height calc(100vh - 80px)
  @media (max-width: 768px)
    height auto
    min-height calc(100vh - 80px)

.sidebar
  background rgba(255, 255, 255, 0.05)
  backdrop-filter blur(10px)
  border-right 1px solid rgba(255, 255, 255, 0.1)
  padding 20px
  
  .dynamic-banner
    height 80px
    margin-bottom 20px
    background linear-gradient(45deg, #1a1c2c, #4a1942)
    border-radius 10px
    overflow hidden
    position relative
    
    .banner-content
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      
      .banner-animation
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        width 200%
        height 200%
        background radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%, transparent 20%, rgba(255,255,255,0.1) 20.5%, transparent 30%)
        background-size 50px 50px
        animation rotate 20s linear infinite, pulse 4s ease-in-out infinite alternate
        
  .welcome-card
    background rgba(255, 255, 255, 0.1)
    border none
    color #fff
    
    .welcome-header
      background rgba(255, 255, 255, 0.1)
      padding 15px
      
      .welcome-title
        font-size 20px
        font-weight bold
        
    .welcome-content
      padding 20px
      line-height 1.6
      
.game-container
  padding 40px
  display flex
  align-items center
  justify-content center
  @media (max-width: 768px)
    padding 20px

.game-grid
  display grid
  grid-template-columns repeat(2, 1fr)
  gap 40px
  width 100%
  max-width 1200px
  @media (max-width: 1024px)
    gap 20px
    
  @media (max-width: 768px)
    grid-template-columns 1fr
    padding 10px

.game-card
  position relative
  height 300px
  border-radius 20px
  overflow hidden
  cursor pointer
  background rgba(255, 255, 255, 0.1)
  backdrop-filter blur(5px)
  transition all 0.3s ease
  
  &:hover
    transform translateY(-10px)
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.3)
    
    .card-overlay
      opacity 0.8
      
    .game-title
      transform translateY(-5px)
      
  &.game-card-landlord
    background linear-gradient(45deg, #ff6b6b, #feca57)
    
    .card-overlay
      background linear-gradient(45deg, #ff6b6b88, #feca5788)
      
  .game-card-inner
    position relative
    z-index 2
    height 100%
    padding 30px
    display flex
    flex-direction column
    justify-content center
    align-items center
    color #fff
    
  .game-icon
    font-size 48px
    margin-bottom 20px
    
    i
      background linear-gradient(135deg, #fff, #ffd700)
      -webkit-background-clip text
      -webkit-text-fill-color transparent
      
  .game-title
    font-size 28px
    font-weight bold
    margin-bottom 15px
    transition transform 0.3s ease
    text-shadow 0 2px 4px rgba(0, 0, 0, 0.3)
    
  .game-description
    font-size 16px
    opacity 0.9
    text-align center
    margin-bottom 20px
    
  .game-players
    font-size 14px
    display flex
    align-items center
    gap 8px
    
    .online-dot
      width 8px
      height 8px
      border-radius 50%
      background #4cd137
      box-shadow 0 0 10px #4cd137
      animation pulse 2s infinite
      
  .card-overlay
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background linear-gradient(45deg, rgba(76, 209, 55, 0.3), rgba(68, 189, 255, 0.3))
    opacity 0
    transition opacity 0.3s ease
    
@keyframes pulse
  0%
    transform scale(1)
    opacity 1
  50%
    transform scale(1.2)
    opacity 0.7
  100%
    transform scale(1)
    opacity 1

@keyframes shine
  0%
    left -100%
  100%
    left 100%

@keyframes rotate
  0%
    transform translate(-50%, -50%) rotate(0deg)
  100%
    transform translate(-50%, -50%) rotate(360deg)

@keyframes pulse
  0%
    opacity 0.5
    background-size 50px 50px
  100%
    opacity 1
    background-size 60px 60px

#live2d-widget
  position fixed !important
  right 0
  bottom 0
  z-index 999
  @media (max-width: 768px)
    display none !important
</style>