/**
 * Created by Yu Tian Xiong on 2018/05/22.
 * fileName:app.js 入口文件
 */
import React, {Component} from 'react';
import './App.less';
import {Route, Link, withRouter,Switch} from 'react-router-dom';
import {Layout, Menu, Breadcrumb, Icon, message} from 'antd';
import routes, {breadcrumbNameMap} from '../../router';
import SiderMenu from './SiderMenu';
import Token from '../../basics/token';
import config from '../../config';
import Api from '../../api';

const {SubMenu} = Menu;
const {Header, Content} = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: [],
      openKeys: [],
      userInfo: null,
      menu: []
    };
  }

  componentDidMount() {
    this.validateToken(() => {
      this.getUserPubFrmGroups()
    })
  }

  // 验证入口页面身份权限
  validateToken(callback) {
    if (Token.getUserToken()) {
      this.setState({identity: true});
      callback();
    } else {
      Token.fetchUserToken().then(res => {
        if (res.Ret === 0) {
          Token.setUserToken(res.Data.Token);
          this.setState({identity: true});
          callback();
        } else {
          console.error(res.Msg)
        }
      })
    }
  }

  // 获取用户信息（包含组织机构列表）
  getUserPubFrmGroups = () => {
    Api.Info.getUserInfo().then(res => {
      if (res.Ret === 0) {
        const data = res.Data;
        this.setState({
          userInfo: res.Data
        });
        this.getCurrMbrInfo(data.ZXGroups[0].GID)
      } else {
        message.error('您没有权限哦！', 1, () => {
          window.location.href = config.appAddress;
        })
      }
    })
  };
  //获取菜单列表
  getCurrMbrInfo = (GID) => {
    Api.Info.GetCurrUserMenuList({GID}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          menu: res.Data
        });
        this.showLayout()
      } else {
        message.error(res.Msg)
      }
    })
  };
  //左侧菜单开关
  toggle = () => {
    this.setState({collapsed: !this.state.collapsed})
  };
  //右侧顶部菜单
  handleHorizontalMenuClick = (e) => {
    if (e.key === "back") {
      Token.delToken();
      Token.delGid();
      Token.delUserLevel();
      Token.delUid();
      Token.delUserInfo();
      window.location.href = config.appAddress;
    } else {
      this.getCurrMbrInfo(e.key);
      this.props.history.push('/');
    }
  };
  // 隐藏加载等待
  showLayout = () => document.getElementsByClassName('pace')[0].style.opacity = 0;

  render() {
    const {collapsed, userInfo, menu} = this.state;
    const {location} = this.props;
    //  路径导航配置
    let pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      if (pathSnippets.length - 1 !== index && breadcrumbNameMap[url].component) {
        return (
          <Breadcrumb.Item key={url}><Link to={url}>{breadcrumbNameMap[url].name}</Link></Breadcrumb.Item>);
      } else {
        //if(breadcrumbNameMap[url] )
        return (
          <Breadcrumb.Item
            key={url}>{breadcrumbNameMap[url] ? breadcrumbNameMap[url].name : ''}</Breadcrumb.Item>);
      }

    });
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home"><Link to="/">首页</Link></Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
    return (
      <Layout>
        <Header className="header">
          <span className="logo"><i className="icon-logo"/>优信官方后台</span>
          <Icon className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
                style={{color: '#fff'}}
          />
          <Menu
            onClick={this.handleHorizontalMenuClick}
            mode="horizontal"
            theme="dark"
            className="menu-horizontal">
            <SubMenu key={1} title={
              <div className="user-info">
                {
                  userInfo &&
                  <i className="user-pic" style={{backgroundImage: `url(${userInfo.Pic})`}}/>
                }
                {userInfo && userInfo.Name}
                <Icon type="caret-down"/>
              </div>}>
              {
                userInfo && userInfo.ZXGroups.length && userInfo.ZXGroups.map(item => <Menu.Item
                  key={item.GID} style={{
                  background: '#404040',
                  margin: 0
                }}><span>{item.Name}</span></Menu.Item>)
              }
              <Menu.Divider/>
              <Menu.Item key="back" style={{background: '#404040', margin: 0}}><Icon type="logout"/>返回</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Layout>
          <SiderMenu
            collapsed={collapsed}
            navData={menu}
            location={location}
          />
          <Layout style={{padding: '0 24px 24px'}}>
            <Breadcrumb style={{margin: '16px 0'}}>
              {breadcrumbItems}
            </Breadcrumb>
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
              <Switch>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} exact={route.exact} component={route.component}/>
                ))}
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(App);
