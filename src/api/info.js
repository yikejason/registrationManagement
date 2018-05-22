/**
 * Created by Yu Tian Xiong on 2017/12/14.
 */
import InfoFetch from './fetch';

export default {
    //获取用户基本信息   首次进入机构页
    getUserInfo: data => InfoFetch('GET', 'ZX/v3/AuthGW/GetCurrUserInfo', data),
    //获取组织机构
    getUserPubFrmGroups: data => InfoFetch('GET', 'ZX/v3/AuthGW/GetCurrUserGroupList', data),
    //获取菜单列表（获取组织机构后）
    GetCurrUserMenuList: data => InfoFetch('GET', 'ZX/v3/AuthGW/GetCurrUserMenuList', data),

}