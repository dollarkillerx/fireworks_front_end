import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  const isLogin = !!getToken();

  console.log(to.path)
  if (to.path === "/login") {
    next()
  }else {
    isLogin ? next(): next("/login")
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
