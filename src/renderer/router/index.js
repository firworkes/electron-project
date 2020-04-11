import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/page/Index').default
    },
    {
      path: '/table',
      name: 'table',
      component: require('@/page/MyTable').default
    },
    {
      path: '/mytablecolumn',
      name: 'mytablecolumn',
      component: require('@/page/MyTableColumn').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
