<template>
  <div class="Index">
    <Header></Header>
    <div class="Index-box">
      <div class="box-left">
        <div class="reel" style="--p: 5">
          <div class="reel-bg"></div>
        </div>
        <article>
          <img src="~@/assets/tip.png" style="object-fit:scale-down" />
        </article>
      </div>
      <div class="box-right">
        <div
          class="gameOne"
          v-for="(item,index) in gameArr"
          :key="index"
          @click="goGame(item.name)"
          v-click-sound
        >
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { L2Dwidget } from "live2d-widget";
import Header from "../components/header.vue";
export default {
  name: "Index",
  components: {
    Header
  },
  data() {
    return {
      gameArr: [
        { name: "多人斗地主", pic: "" },
        // { name: "画图猜字", pic: "" },
        // { name: "朋友圈", pic: "" },
        // { name: "看视频", pic: "" },
        // { name: "听音乐", pic: "" },
        { name: "聊天室", pic: "" }
      ]
    };
  },
  methods: {
    goGame(name) {
      if (name === "聊天室") {
        this.$router.push("/chatRoom");
      } else if (name === "多人斗地主") {
        this.$router.push("/pokerHall");
      }
    }
  },
  created() {
    setTimeout(function() {
      L2Dwidget.init({
        model: {
          jsonPath:
            "https://cdn.jsdelivr.net/gh/wangsrGit119/wangsr-image-bucket/L2Dwidget/live2d-widget-model-haruto/assets/haruto.model.json"
        }
      });
    }, 1000);
  },
  mounted() {
    if (!CSS.supports("animation-timeline: scroll()")) {
      console.log("不支持 animation-timeline");
      const bg = document.querySelector(".reel-bg");
      const boxLeft = document.querySelector(".box-left");
      boxLeft.addEventListener("scroll", function() {
        console.log("this.scrollTop", this.scrollTop);
        bg.style.transform = `translateY(${(((this.scrollTop / Math.PI) % 184) /
          368) *
          100 -
          80}%)`;
      });
    }
  },
  beforeDestroy() {
    document.querySelector("#live2d-widget").remove(); //离开页面时销毁L2Dwidget
  }
};
</script>

<style lang="stylus" scoped>
.Index
  height 100vh
  // background-color #b1dced
  min-width 750px
  min-height 555px
  background-image url('../assets/hall.jpg')
  background-repeat no-repeat
  background-size cover
  .Index-box
    display flex
    height calc(100% - 3.75rem)
    .box-left
      flex 1
      align-self flex-start
      background-color #22312D
      font-family '楷体', '楷体_GB2312', 'KaiTi', serif
      overflow auto
      height 60%
      min-width 300px
      min-height 500px
      &::-webkit-scrollbar
        display none
      &:before
        content ''
        display block
        height 30px
        background-color #22312D
        position sticky
        top 0
      article
        background-color #F5EBD4
        padding 1em 0.5em
        border-left 10px solid #405C53
        border-right 10px solid #405C53
        margin 0 15px
      p
        margin 0
        padding 0.2em 0
        color #2C402E
        line-height 150%
        text-indent 2em
      h1
        text-align center
        color #F5EBD4
      .reel
        position sticky
        top 10px
        height 28px
        margin 0 15px
        border-radius 1px
        border-image url('https://imgservices-1252317822.image.myqcloud.com/coco/s04232024/c510959b.0txvec.png') fill 40 36 / 14px 12px / 0 12px
        box-shadow 0 5px 10px 5px rgba(0, 0, 0, 0.3), 0 10px 20px 10px rgba(0, 0, 0, 0.5)
        overflow hidden
      .reel-bg
        position absolute
        left 0
        width 100%
        height 368px
        background url('https://imgservices-1252317822.image.myqcloud.com/coco/s04232024/682ad393.to0id6.jpg') 50% 0 / auto 50%
        mix-blend-mode multiply
      @supports (animation-timeline scroll())
        .reel-bg
          --s 999999
          animation scroll 1s linear forwards calc((var(--s) / 184 / 3.14))
          animation-timeline scroll()
          animation-range 0 calc(var(--s) * 1px)
      @keyframes scroll
        0%
          transform translateY(-80%)
        100%
          transform translateY(-30%)
    .box-right
      flex 3
      display flex
      flex-wrap wrap
      justify-content space-around
      align-items center
      .gameOne
        width 30%
        height 20%
        box-shadow 1px 0px 5px 0px #ccc
        border-radius 5px
        transition transform 0.3s
        display flex
        justify-content center
        align-items center
        &:nth-child(1)
          background-image linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)
        &:nth-child(2)
          background-image linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)
        // &:nth-child(3) {
        // background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
        // }

        // &:nth-child(4) {
        // background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
        // }

        // &:nth-child(5) {
        // background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
        // }

        // &:nth-child(6) {
        // background-image: linear-gradient(to top, #37ecba 0%, #72afd3 100%);
        // }
        &:hover
          transform scale(1.1)
      span
        font-size 25px
        letter-spacing 1px
        font-weight 700
        font-family 'AlimamaFangYuanTiVF-Thin'
</style>