<template>
  <div class="login">
    <el-container class="box">
      <el-main>
        <div class="form-header">江雪休闲大厅</div>
        <el-form v-show="flag" ref="form" :model="formLogin" :rules="rulesform">
          <el-form-item prop="name" style="margin: 30px 30px 20px">
            <el-input
              v-model.trim="formLogin.name"
              placeholder="请输入账号/手机号"
              @keyup.13.native="onSubmit"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin: 20px 30px 30px 30px">
            <el-input
              v-model.trim="formLogin.password"
              type="password"
              placeholder="请输入密码"
              @keyup.13.native="onSubmit"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="onSubmit"
              style="width: 350px;font-size:16px"
            >登 录</el-button>
          </el-form-item>
        </el-form>
        <el-form v-show="!flag" ref="form" :model="formReg" label-width="60px" :rules="rulesform">
          <el-form-item prop="regName" label="账号" class="formLine" style="margin: 20px 30px">
            <el-input v-model.trim="formReg.regName" placeholder="账号" @keyup.13.native="onSubmit">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="regPassword" label="密码" class="formLine" style="margin: 20px 30px">
            <el-input
              v-model.trim="formReg.regPassword"
              placeholder="密码"
              @keyup.13.native="onSubmit"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="regAvatar" label="头像" class="formLine">
            <el-upload
              class="avatar-uploader"
              :action="$basrUrl + 'api/uploadPicture'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="formReg.regAvatar" :src="formReg.regAvatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button
              type="primary"
              :loading="loading"
              @click="onSubmit"
              style="width: 350px;font-size:16px"
            >注 册</el-button>
          </el-form-item>
        </el-form>
        <div class="regUser" @click="regUser">{{flag ? '注 册' : '登 录'}}</div>
      </el-main>
    </el-container>
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
      imageUrl: "",
      flag: true,
      formReg: {
        regAvatar: "",
        regName: "",
        regPassword: ""
      },
      rulesform: {},
      loading: false,
      loadingCodeLogins: false,
      formLogin: {},
      rulesform: {
        // 账号登录表单验证
        name: [{ validator: validateCode, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    beforeAvatarUpload() {},
    handleAvatarSuccess(response, file, fileList) {
      if (response) {
        this.formReg.regAvatar = URL.createObjectURL(file.raw);
        this.imageUrl = file.response.imgUrl;
      }
    },
    regUser() {
      this.flag = !this.flag;
    },
    onSubmit() {
      this.flag ? this.onSubmit1() : this.onSubmit2();
    },
    onSubmit1() {
      let rulesform = "form";
      this.$refs[rulesform].validate(valid => {
        if (valid) {
          this.loading = true;
          let body = {};
          body.username = this.formLogin.name;
          body.password = this.formLogin.password;
          this.$AXIOS("/api/login", "post", body).then(res => {
            this.loading = false;
            if (res.status === 0) {
              this.$notify({
                title: "成功",
                message: `${res.message}`,
                type: "success"
              });
              this.$store.commit("setUserInfo", res);
              this.$router.push("/index");
            } else {
              this.$message.error(`${res.message}`);
            }
          });
        }
      });
    },
    onSubmit2() {
      let rulesform = "form";
      this.$refs[rulesform].validate(valid => {
        if (valid) {
          this.loading = true;
          let body = {};
          body.username = this.formReg.regName;
          body.password = this.formReg.regPassword;
          body.avatar = this.imageUrl;
          this.$AXIOS("api/reguser", "post", body).then(res => {
            this.loading = false;
            if (res.status === 0) {
              this.$notify({
                title: "成功",
                message: "注册成功!",
                type: "success"
              });
              this.formReg = {
                regAvatar: "",
                regName: "",
                regPassword: ""
              };
              setTimeout(() => {
                this.flag = !this.flag;
              }, 2000);
            } else {
              this.$message.error(`${res.message}`);
            }
          });
        }
      });
    }
  },
  mounted() {
    console.log(this.$socket, "$socket");
  }
};
</script>
<style lang="stylus" scoped >
.login
  width 100vw
  height 100vh
  background rgb(1, 37, 51) url('../assets/bgp.jpg') no-repeat center / 1912px
  position relative
  overflow hidden
  .box
    position absolute
    border 1px solid #a0b1c4
    left 50%
    width 450px
    background-color rgba(0, 0, 0, 0.2)
    top 50%
    transform translate(-50%, -50%)
    border-radius 5px
    box-shadow 0px 0px 3px #ccc
    .form-header
      margin-top 15px
      font-size 25px
      color #fff
      margin-bottom 30px
      font-family 'AlimamaDaoLiTi'
      background url('~@/assets/btn.png') center / cover
    /deep/.el-form-item__label
      color #fff
    .regUser
      color #fff
      font-size 12px
      cursor pointer
    .regForm
      box-sizing border-box
      border-radius 5px
      // box-shadow: 0px 0px 5px #ccc;
      background-color #ffffff
      width 400px
      height 500px
      padding-top 20px
    .formLine
      margin 30px 30px
      padding-right 20px
    .login
      margin-top 15px
      color #000
      font-size 12px
      cursor pointer
  .el-footer
    position fixed
    bottom 0
    width 100%
    text-align center
    font-size 12px
    color #fff
</style>
<style>
.avatar-uploader {
  text-align: left;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  height: 100px;
  width: 100px;
  border-radius: 5%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  border-radius: 50%;
  text-align: center;
}
.avatar-uploader-icon::before {
  content: "\E6D9";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar {
  width: 100px;
  height: 100px;
  /* border-radius: 50%; */
  display: block;
  object-fit: cover;
}
</style>

