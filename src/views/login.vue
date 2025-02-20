<template>
  <div class="auth-container">
    <div class="auth-box" :class="{ 'show-register': showRegister }">
      <div class="forms-container">
        <div class="login-register-form login" :class="{ 'form-hidden': showRegister }">
          <div class="title-wrapper">
            <div class="title">江江23大厅</div>
            <div class="title-decoration left"></div>
            <div class="title-decoration right"></div>
          </div>
          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="input-group">
              <i class="user-icon">👤</i>
              <input type="text" v-model="loginForm.username" placeholder="请输入账号/手机号" required />
            </div>

            <div class="input-group">
              <i class="lock-icon">🔒</i>
              <input type="password" v-model="loginForm.password" placeholder="请输入密码" required />
            </div>

            <button type="submit" class="auth-btn">登录</button>
          </form>
        </div>

        <div class="login-register-form register" :class="{ 'form-hidden': !showRegister }">
          <div class="title-wrapper">
            <div class="title">用户注册</div>
            <div class="title-decoration left"></div>
            <div class="title-decoration right"></div>
          </div>

          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="input-group">
              <i class="user-icon">👤</i>
              <input type="text" v-model="registerForm.username" placeholder="请输入账号" required />
            </div>
            <div class="input-group">
              <i class="lock-icon">🔒</i>
              <input type="password" v-model="registerForm.password" placeholder="请输入密码" required />
            </div>
            <div class="avatar-upload">
              <label for="avatar-input" class="avatar-label">
                <div v-if="!avatarPreview" class="avatar-placeholder">
                  <i class="upload-icon">📤</i>
                </div>
                <img v-else :src="avatarPreview" alt="avatar" class="avatar-preview" />
                <span>上传头像</span>
              </label>
              <input
                type="file"
                id="avatar-input"
                @change="handleAvatarUpload"
                accept="image/*"
                class="avatar-input"
              />
            </div>
            <button type="submit" class="auth-btn">注册</button>
          </form>
        </div>
      </div>
      <div class="switch-form">
        <a href="#" @click.prevent="toggleForm">{{ showRegister ? '返回登录' : '注册账号' }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthForm",
  data() {
    return {
      obj:Object.freeze({name:'zhangsan',age:18,b:{c:1,d:{e:2}}}),
      showRegister: false,
      loginForm: {
        username: "",
        password: ""
      },
      registerForm: {
        username: "",
        password: "",
        avatar: null
      },
      avatarPreview: "",
      imageUrl: ""
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      let body = {};
      body.username = this.loginForm.username;
      body.password = this.loginForm.password;
      this.$AXIOS("api/login", "post", body).then(res => {
        this.loading = false;
        if (res.status === 0) {
          this.$notify({
            title: "成功",
            message: `${res.message}`,
            type: "success"
          });
          this.$store.commit("setUserInfo", res);
          this.$router.push("/index");
        }
      });
    },
    async handleRegister() {
      try {
        // 添加密码长度验证
        if (
          this.registerForm.password.length < 6 ||
          this.registerForm.password.length > 12
        ) {
          this.$message.warning("密码长度应为6-12个字符");
          return;
        }
        this.loading = true;
        // 先上传图片
        if (this.registerForm.avatar) {
          const formData = new FormData();
          formData.append("file", this.registerForm.avatar);

          const uploadRes = await this.$AXIOS(
            "/api/uploadPicture",
            "post",
            formData
          );
          if (!uploadRes.imgUrl) {
            this.$message.error("图片上传失败");
            this.loading = false;
            return;
          }
          this.imageUrl = uploadRes.imgUrl; // 保存返回的图片URL
        } else {
          this.$message.warning("请先上传头像");
          return;
        }
        // 构建注册请求数据
        const registerData = {
          username: this.registerForm.username,
          password: this.registerForm.password,
          avatar: this.imageUrl // 使用上传后的图片URL
        };
        // 调用注册接口
        const registerRes = await this.$AXIOS(
          "/api/reguser",
          "post",
          registerData
        );
        if (registerRes.status === 0) {
          this.$message.success("注册成功");
          setTimeout(this.toggleForm, 1500);
          // 切换到登录tab
        } else {
          this.$message.error(registerRes.message || "注册失败");
        }
      } catch (error) {
        console.error("注册错误:", error);
        this.$message.error("注册失败");
      } finally {
        this.loading = false;
      }
    },
    toggleForm() {
      this.showRegister = !this.showRegister;
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      this.registerForm.avatar = file;
      this.avatarPreview = URL.createObjectURL(file);
    }
  },
  created(){
    console.log(this.obj);    
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  pointer-events: none;
}

.auth-box {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.forms-container {
  position: relative;
  height: 450px;
  overflow: hidden;
}

.login-register-form {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.login {
  transform: translateX(0);
}

.register {
  transform: translateX(100%);
}

.show-register .login {
  transform: translateX(-100%);
}

.show-register .register {
  transform: translateX(0);
}

.form-hidden {
  pointer-events: none;
}

.title-wrapper {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  color: white;
  padding: 10px 30px;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  display: inline-block;
  border-radius: 20px;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.title-decoration {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: #3a7bd5;
  transform: translateY(-50%) rotate(45deg);
}

.title-decoration.left {
  left: 20px;
}

.title-decoration.right {
  right: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group input {
  width: 100%;
  padding: 12px 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.input-group input:focus {
  outline: none;
  border-color: #00d2ff;
  background: rgba(255, 255, 255, 0.2);
}

.user-icon,
.lock-icon {
  position: absolute;
  left: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-style: normal;
}

.auth-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 210, 255, 0.3);
}

.auth-btn:active {
  transform: translateY(0);
}

.switch-form {
  text-align: center;
  margin-top: 20px;
}

.switch-form a {
  color: #00d2ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.switch-form a:hover {
  color: #3a7bd5;
}

.avatar-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.avatar-label:hover .avatar-preview {
  border-color: #00d2ff;
}

.avatar-label span {
  color: white;
  font-size: 14px;
}

.avatar-input {
  display: none;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
}

.upload-icon {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.7);
  font-style: normal;
}

@media (max-width: 768px) {
  .auth-box {
    max-width: 380px;
    padding: 25px;
    margin: 20px;
  }

  .forms-container {
    height: 420px;
  }

  .title {
    font-size: 20px;
    padding: 8px 20px;
  }

  .input-group input {
    padding: 12px 35px;
    font-size: 15px;
  }

  .auth-btn {
    padding: 12px;
    font-size: 16px;
  }

  .avatar-preview,
  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .auth-box {
    max-width: 320px;
    padding: 20px 15px;
    margin: 15px;
  }

  .forms-container {
    height: 400px;
  }

  .title {
    font-size: 18px;
    padding: 6px 18px;
  }

  .input-group input {
    padding: 10px 32px;
    font-size: 14px;
  }

  .avatar-preview,
  .avatar-placeholder {
    width: 70px;
    height: 70px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .auth-box {
    max-width: 420px;
    padding: 30px;
    margin: 25px;
  }

  .forms-container {
    height: 440px;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .auth-box {
    max-width: 480px;
    margin: 15px;
  }

  .forms-container {
    height: 380px;
  }

  .title {
    font-size: 18px;
    padding: 6px 18px;
  }

  .input-group {
    margin-bottom: 12px;
  }

  .avatar-upload {
    margin-bottom: 8px;
  }

  .avatar-preview,
  .avatar-placeholder {
    width: 60px;
    height: 60px;
  }
}
</style>