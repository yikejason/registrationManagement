/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import React from 'react';
import infoManagement from './infoManagement';
import breadcrumbNameMap from './breadcrumb';

const routers = [
  {
    path: '/',
    exact: true,
    component: () => <div>优信官方管理后台</div>
  },
  ...infoManagement,
];


export default routers;
export {breadcrumbNameMap}
