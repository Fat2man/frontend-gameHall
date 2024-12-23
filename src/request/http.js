import axios from 'axios'
import router from '../router'
import Vue from 'vue'
const baseURL = process.env.VUE_APP_BASE_URL
const instance = axios.create({
  baseURL: baseURL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
// 修改消息处理方式
const getMessage = () => Vue.prototype.$message
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  let token = JSON.parse(sessionStorage.getItem('mytoken'))  // 获取本地存储的token值
  if (token) {// 判断token值是否存在
    config.headers['Authorization'] = token // 如果token值存在，就将token值放在请求头中，发送给服务器
  }
  return config
}, function (error) {
  return Promise.reject(error)
})


// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const { data: { status, message: msg, data } } = response
  if (status === 2) {
    router.push('/').catch(err => { })
    getMessage().warning(msg || '请重新登录')
    return
  } else if (status !== 0) {
    const warningMsg = msg || (data && data.message) || '操作失败'
    getMessage().warning(warningMsg)
  }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  getMessage().error(error.message || '请求失败')
  return Promise.reject(error);
});
// async function refreshToken() {
// 	return new Promise((resolve,reject) => {
// 		let param = {}
// 		AXIOS.apiMethod('getNewAccessToken', "post", param, res => {
// 			if (res.err === 0) {
// 				resolve(res.data)
// 			} else {
// 				resolve({})
// 			}
// 		},err => {
// 			reject({})
// 		},false)
// 	})
// }
export default function request(url, method, params, headers) {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: method ? method : "GET",
      data: method === 'post' ? params : {},
      params: method === 'get' ? params : {},
      headers,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => {
        getMessage().error(error.message || '网络请求失败');
        reject(error);
      });
  });
}