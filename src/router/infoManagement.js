/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import { AsyncComponent } from '../components';

const InfoManagement = AsyncComponent(() => import('../views/info-management/InfoManagement'));
export default [
    {
        path: '/reports',
        exact: true,
        component: InfoManagement
    },
]

