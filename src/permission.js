import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

/**
 *前置守卫
 *
*/

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      // 判断是否获取过资料
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus)
        // console.log(asyncRoutes)
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        }) // 筛选中的路由
        // 添加动态路由信息到路由表
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // router添加动态路由之后, 需要转发
        next(to.path) // 让路由拥有信息 router的已知缺陷
      } else {
        next() // 放过
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 中转到登录页
      nprogress.done()
    }
  }
})

/** *
 * 后置守卫
 * **/
router.afterEach(() => {
  nprogress.done()
})
