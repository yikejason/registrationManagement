/**
 * Created by Yu Tian Xiong on 2017/12/13.
 * 生产环境下
 */

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

 export default {
     api: `${protocol}`,
     appSecret: '',
     appAddress: ''
 }