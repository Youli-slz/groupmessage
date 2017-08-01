import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: require('views/Login')
    },{
      path: '/main',
      component: require('components/Main'),
      children: [  
        {
          path: '/loginrobot',
          component: require('views/LoginRobot')
        },
        {
          path: '/madegroup',
          component: require('views/MadeGroup')
        },
        {
          path: '/book',
          component: require('views/Book')
        },
        {
          path: '/bookitem',
          component: require('views/BookItem')
        },
        {
          path: '/chapter',
          component: require('views/Chapter')
        },
        {
          path: '/addbanner',
          component: require('views/AddBanner')
        },
        {
          path: '/story',
          component: require('views/Story')
        }
      ]
    },
    {
        path: '/groupmessage',
        component: require('views/GroupMessage')
      }
  ]
})
