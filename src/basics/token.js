/**
 * Created by Yu Tian Xiong on 2017/12/14.
 */
import UcuStorage from './ux-storage';
import config from '../config';
import md5 from 'blueimp-md5';
import params from './params';

import qs from 'qs';
const UCUXIN_TOKEN_APP = 'UCUXIN_TOKEN_APP';  // 应用Token
const UCUXIN_TOKEN_USER = 'UCUXIN_TOKEN_USER';// 用户Token
const UCUXIN_GID = 'UCUXIN_GID';              // 机构ID
const UCUXIN_USER_LEVEL = 'UCUXIN_USER_LEVEL';// 用户等级
const UCUXIN_USER_UID = 'UCUXIN_USER_UID';    // 用户UID
const UCUXIN_USER_INFO = 'UCUXIN_USER_INFO';  // 用户信息

export default class Token {
    // 获取本地已存在的用户Token
    static getUserToken() {
        return config[UCUXIN_TOKEN_USER] || UcuStorage().get(UCUXIN_TOKEN_USER);
    }

    // 获取本地已存在的应用Token
    static getAppToken() {
        return config[UCUXIN_TOKEN_APP] || UcuStorage().get(UCUXIN_TOKEN_APP);
    }

    // 设置本地用户Token
    static setUserToken(token) {
        UcuStorage().set(UCUXIN_TOKEN_USER, token);
        config[UCUXIN_TOKEN_USER] = token;
    }

    // 设置本地应用Token
    static setAppToken(token) {
        UcuStorage().set(UCUXIN_TOKEN_APP, token);
        config[UCUXIN_TOKEN_APP] = token;
    }

    // 删除Token
    static delToken() {
        UcuStorage().del(UCUXIN_TOKEN_USER);
    }

    // =======================================================================================
    // 获取当前时间戳
    static getCurrentTime() {
        return parseInt(new Date().getTime() / 1000, 10);
    }

    // 从服务器获取最新用户Token
    static fetchUserToken() {
        // 生产环境从地址栏获取用户token
        if (process.env.NODE_ENV === `production`) {
            const token = params.searchParamName('AccessToken');  // 值为字符串或null
            return new Promise(function (resolve, reject) {
                if (token) {
                    resolve({Ret: 0, Data: {Token: token}});
                } else {
                    reject('AccessToken is not found！');
                }
            })
        }

        if (process.env.NODE_ENV === `development`) {
            const ts = this.getCurrentTime();
            return fetch(`${config.api}base/v3/Auth/GetOpenAPITokenByUser?${qs.stringify({
                uxcode: config.user,
                md5pwd: md5(config.pwd),
                appid: config.appId,
                ts,
                md5ts: md5(config.appSecret + ts)
            })}`).then(function (response) {
                return response.json();
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            });
        }
    }

    // 从服务器获取最新应用oken
    static fetchAppToken() {
        const ts = this.getCurrentTime();
        return fetch(`${config.api}base/v3/Auth/GetOpenAPITokenByAppid?${qs.stringify({
            appid: config.appId,
            ts: ts,
            md5ts: md5(config.appSecret + ts)
        })}`).then(function (response) {
            return response.json();
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        });
    }

    // =======================================================================================
    // 组织机构
    static getGid() {
        return config[UCUXIN_GID] || UcuStorage().get(UCUXIN_GID);
    }

    static setGid(gid) {
        UcuStorage().set(UCUXIN_GID, gid);
        config[UCUXIN_GID] = gid;
    }

    static delGid() {
        UcuStorage().del(UCUXIN_GID);
    }

    // 用户等级
    static getUserLevel() {
        const level = config[UCUXIN_USER_LEVEL] || UcuStorage().get(UCUXIN_USER_LEVEL);
        return +level;
    }

    static setUserLevel(level) {
        UcuStorage().set(UCUXIN_USER_LEVEL, level);
        config[UCUXIN_USER_LEVEL] = level;
    }

    static delUserLevel() {
        UcuStorage().del(UCUXIN_USER_LEVEL);
    }

    // 用户UID
    static getUid() {
        return config[UCUXIN_USER_UID] || UcuStorage().get(UCUXIN_USER_UID);
    }

    static setUid(uid) {
        UcuStorage().set(UCUXIN_USER_UID, uid);
        config[UCUXIN_USER_UID] = uid;
    }

    static delUid() {
        UcuStorage().del(UCUXIN_USER_UID);
    }

    // 用户Info
    static getUserInfo() {
        return config[UCUXIN_USER_INFO] || UcuStorage().get(UCUXIN_USER_INFO);
    }

    static setUserInfo(info) {
        UcuStorage().set(UCUXIN_USER_INFO, info);
        config[UCUXIN_USER_INFO] = info;
    }

    static delUserInfo() {
        UcuStorage().del(UCUXIN_USER_INFO);
    }
}
