<template>
  <div class="login">
    <el-container class="box">
      <el-main>
        <el-form ref="form" :model="formLogin" :rules="rulesform">
          <div class="form-header">专业在线聊天室</div>
          <el-form-item prop="name" style="margin: 20px 30px">
            <el-input v-model.trim="formLogin.name" placeholder="请输入账号/手机号" @keyup.13.native="onSubmit">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin: 20px 30px">
            <el-input v-model.trim="formLogin.password" type="password" placeholder="请输入密码" @keyup.13.native="onSubmit">
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="onSubmit" style="width: 350px">登 录</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-footer>
      <div class="first">
        <a href="#" style="padding-left: 10px; course: pointer; color: white">技术支持：武汉江雪科技有限公司</a>
      </div>
      <div class="second"><span>Copyright 2023 - 2025 .jxtech.All Rights Reserved. </span></div>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      loadingCodeLogins: false,
      formLogin: {},
      rulesform: {
        // 账号登录表单验证
        name: [{ validator: validateCode, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
      },
    };
  },
  methods: {
    onSubmit() {
      let rulesform = "form";
      this.$refs[rulesform].validate((valid) => {
        if (valid) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$message({
              message: "登录成功！",
              type: "info",
              duration: 1500,
            });
            this.$router.push("home");
          }, 500);
        }
      });
    },
  },
};
</script>
<style scoped lang="stylus">
.login
    overflow hidden
    width 100vw
    height 100vh
    background url("../assets/bgp.jpg") no-repeat center center
    background-size cover
    position relative
    overflow hidden
    .box
      position absolute
      border 1px solid #a0b1c4
      right 50px
      width 450px
      height 330px
      background-color #ffffff
      top 50%
      transform translateY(-50%)
      border-radius 5px
      .form-header
        margin-top 20px
        font-size 20px
        color #000
        margin-bottom 30px
    .el-footer
      position fixed
      bottom 0
      width 100%
      text-align center
      font-size 12px
      color #fff
</style>
