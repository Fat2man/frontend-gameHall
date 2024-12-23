import CustomMessage from '@/components/CustomMessage.vue'
import Vue from 'vue'
// 创建一个单例实例
const MessageConstructor = Vue.extend(CustomMessage);
const instance = new MessageConstructor({
  el: document.createElement('div'),
});
document.body.appendChild(instance.$el);

// 创建显示消息的核心方法
const showMessage = (options) => {
  const { message, type = 'info', duration = 3000 } = options;
  instance.message = message;
  instance.type = type;
  instance.duration = duration;
  instance.visible = true;

  setTimeout(() => {
    instance.visible = false;
  }, duration);
};

// 创建消息方法
const messageHandler = (options) => {
  if (typeof options === 'string') {
    showMessage({ message: options });
  } else {
    showMessage(options);
  }
};

// 创建各种类型的静态方法
const messageTypes = {
  success(message, duration) {
    showMessage({ message, type: 'success', duration });
  },
  warning(message, duration) {
    showMessage({ message, type: 'warning', duration });
  },
  error(message, duration) {
    showMessage({ message, type: 'error', duration });
  },
  info(message, duration) {
    showMessage({ message, type: 'info', duration });
  },
  message: messageHandler
};

const CusMessage = {
  install(Vue) {
    // 挂载到 Vue 原型上
    Vue.prototype.$message = messageHandler;
    // 将所有方法添加到 Vue 原型的 $message 上
    Object.assign(Vue.prototype.$message, messageTypes);
  },
  // 将所有方法作为静态方法
  ...messageTypes
};

export default CusMessage;