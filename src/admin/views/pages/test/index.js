import { unescapeURI } from '$utils';
import TestBase from './index.vue'
import TestSchedule from './schedule'
import Cases from './cases'
import CaseDetail from './cases/detail'

const routes = {
  path: '/base',
  component: TestBase,
  meta: {
    title: 'API测试-Console'
  },
  children: [
    {
      path: 'cases',
      component: Cases,
      name: 'caseList',
      meta: {
        title: '用例列表-Console'
      },
      beforeEnter: (to, from, next) => {
        console.log('beforeEnter.caselist');
        next();
      },
    },
    {
      path: 'cases/:caseId',
      component: CaseDetail,
      name: 'caseDetail',
      meta: {
        title: '用例详情-Console',
      },
      beforeEnter: (to, from, next) => {
        console.log('beforeEnter.caseDetail');
        next();
      },
      props: true,
    },
    {
      path: 'schedule',
      component: TestSchedule,
      name: 'TestSchedule',
      meta: {
        title: '测试安排-Console',
      },
      beforeEnter: (to, from , next) => {
        console.log('beforeEnter.sceneDetail');
        next();
      },
      props: true,
    },
  ],
}
export { routes };
