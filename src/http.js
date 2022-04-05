import axios from "axios";
import {Message, Loading} from 'element-ui';
import router from "@/router";

// 加载动画
let loading;

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0,0,0,0,7)'
  })
}

// 结束动画
function endLoading() {
  loading.close()
}


// alert(process.env.VUE_APP_BASE_API)
const http = axios.create(
  {
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 14400000
  }
)

// 请求拦截
http.interceptors.request.use(config => {
  // 加载动画
  startLoading();
  // 如果存在token 就设置在请求头中
  if (localStorage.AuthToken) {
    config.headers.token = localStorage.AuthToken
  }

  return config;
}, error => {
  return Promise.reject(error)
})

// 相应拦截
http.interceptors.response.use(response => {
  // 结束加载动画
  endLoading();
  return response;
}, error => {
  // 错误提醒
  endLoading();

  // 判断token是否过期
  const {status} = error.response;
  if (status === 401) {
    Message.error("token失效，请重新登录！")
    // 清除token
    localStorage.removeItem("AuthToken")
    // 跳转到登录页面
    router.push('/login')
  }

  return Promise.reject(error);
});

export default http;
