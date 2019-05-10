import React from 'react';
import { Dropdown, Menu, Icon, message } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import UpdateInfo from './UpdateInfo';

const MenuItem = Menu.Item;

@connect(({auth}) => ({ user: auth.user }))
class UserInfo extends React.Component {
    state = {
        showUpdateInfo: false,
    }
    logout = () => {
        window.localStorage.removeItem('DRDDOPM_OF');
        this.props.dispatch({
            type: 'auth/update',
            payload: {
                user: {
                    ...this.props.user,
                    isLogin: false
                }
            }
        });
        const route = window.location.hash.split('#')[1];
        if (route !== '/login') {
            window.sessionStorage.setItem('oqw50q5y', route);
        }
        this.props.dispatch(routerRedux.push('/login'));
    }
    updateInfo = () => {
        this.setState({
            showUpdateInfo: true,
        });
    }
    onCancel = () => {
        this.setState({
            showUpdateInfo: false,
        });
    }
    onOk = values => {
        const info = {};
        (!!values.name && values.name !== this.props.user.name) && (info.name = values.name);
        !!values.password && (info.password = values.password);

        if (!info.name && !info.password) {
            message.warning('信息未更新');
            return
        };
        this.props.dispatch({
            type: 'users/updateUserInfo',
            payload: {
                ...info,
                account: this.props.user.account,
            },
            cb: res => {
                if(res.c === 200) {
                    let msg = '更新成功';
                    this.onCancel();
                    if (info.name) {
                        this.props.dispatch({
                            type: 'auth/update',
                            payload: {
                                user: {
                                    ...this.props.user,
                                    name: info.name,
                                }
                            }
                        });
                    }
                    if (info.password) {
                        msg += '，重新认证';
                        this.logout();
                    }
                    message.success(msg);
                    return;
                }
                message.error('更新失败' + res.m);
            }
        });
    }
    render() {
        const menu = (
            <Menu style={{textAlign: "center"}}>
                <MenuItem onClick={this.updateInfo}>更新信息</MenuItem>
                <MenuItem onClick={this.logout}>退出</MenuItem>
            </Menu>
        );
        return (
            <section>
                <Dropdown overlay={menu}>
                    <span style={{display: 'flex', alignItems: 'center'}}><Icon type="gitlab" style={{fontSize: '30px'}} />{this.props.user.name}</span>
                </Dropdown>
                {
                    this.state.showUpdateInfo ? 
                    (
                        <UpdateInfo
                            config={
                                {
                                    title: '更新信息',
                                    width: 300,
                                    visible: this.state.showUpdateInfo,
                                    onOk: this.onOk,
                                    onCancel: this.onCancel,
                                }
                            }
                            name={this.props.user.name}
                        />
                    ):null
                }
            </section>
        );
    }
}

export default UserInfo;
