<template>
  <div
    v-if="visible"
    class="custom-message"
    :style="messageStyles"
    :class="messageClass"
  >
    <span>{{ message }}</span>
    <button class="close-btn" @click="closeMessage">×</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info' // 默认消息类型
    },
    duration: {
      type: Number,
      default: 3000 // 默认显示时间
    },
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    messageClass() {
      return `message-${this.type}`;
    },
    messageStyles() {
      return {
        width: 'auto', // 宽度自动，根据消息内容决定
        maxWidth: '400px', // 设置最大宽度，防止过宽
        padding: '10px 20px',
        fontSize: '14px',
        lineHeight: '20px',
      };
    }
  },
  mounted() {
    setTimeout(() => {
      this.visible = false; // 自动隐藏消息
    }, this.duration);
  },
  methods: {
    closeMessage() {
      this.visible = false; // 用户点击关闭按钮时关闭消息
    },
    show() {
      this.visible = true;
      if (this.duration > 0) {
        setTimeout(() => {
          this.visible = false;
        }, this.duration);
      }
    }
  }
};
</script>

<style scoped>
.custom-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9999;
  padding: 8px 16px;
}

.custom-message span {
  flex-grow: 1;
}

.custom-message .close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: inherit;
  opacity: 0.8;
  padding: 0 0 0 12px;
  transition: opacity 0.2s;
  line-height: 1;
  display: flex;
  align-items: center;
}

.custom-message .close-btn:hover {
  opacity: 1;
}

.custom-message .close-btn:focus {
  outline: none;
}

.message-info {
  background-color: #409eff;
  color: white;
}

.message-success {
  background-color: #67c23a;
  color: white;
}

.message-warning {
  background-color: #e6a23c;
  color: white;
}

.message-error {
  background-color: #f56c6c;
  color: white;
}

@media screen and (max-width: 768px) {
  .custom-message {
    width: 90%;
    max-width: 90%;
    font-size: 12px;
  }
}
</style>
