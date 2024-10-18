<template>
  <div class="regUser">
    <div class="regForm">
      <el-form
        ref="form"
        :model="formReg"
        :rules="rulesform"
        label-width="80px"
        class="demo-form-inline"
        label-position="right"
      >
        <el-form-item prop="regName" class="formLine" label="账号">
          <el-input v-model.trim="formReg.regName" placeholder="账号" @keyup.13.native="onSubmit">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="regPassword" class="formLine" label="密码">
          <el-input v-model.trim="formReg.regPassword" placeholder="密码" @keyup.13.native="onSubmit">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="regAvatar" label="上传头像" class="formLine">
          <el-upload
            class="avatar-uploader"
            :action="$basrUrl + 'uploadPicture'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formReg.regAvatar" :src="formReg.regAvatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="loading" @click="onSubmit" style="width: 280px;">注 册</el-button>
      <p class="login" @click="goLogin">登 录</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "regUser",
  data() {
    return {
      loading: false,
      formReg: {
        regAvatar: "",
        regName: "",
        regPassword: ""
      },
      rulesform: {},
      imageUrl: ""
    };
  },
  methods: {
    goLogin() {
      this.$router.push("/");
    },
    onSubmit() {
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
                message: "注册成功，即将跳转登录页",
                type: "success"
              });
              setTimeout(() => {
                this.$router.push("/");
              }, 2000);
            } else {
              this.$message.error(`${res.message}`);
            }
          });
        }
      });
    },
    beforeAvatarUpload() {},
    handleAvatarSuccess(response, file, fileList) {
      if (response) {
        this.formReg.regAvatar = URL.createObjectURL(file.raw);
        this.imageUrl = file.response.imgUrl;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.regUser
  height 100vh
  width 100vw
  background-image url('../assets/regBg.jpg')
  background-attachment fixed
  background-repeat no-repeat
  background-size cover
  display flex
  justify-content center
  align-items center
  .regForm
    box-sizing border-box
    border-radius 5px
    box-shadow 0px 0px 5px #ccc
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
</style>
<style>
.avatar-uploader {
  text-align: left;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 158px;
  height: 158px;
  line-height: 158px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
