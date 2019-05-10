import React from 'react';
import { Menu, Icon } from 'antd';

import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import styles from '../index.css';
import UserInfo from './UserInfo';

const MenuItem = Menu.Item;

@connect(({ auth }) => ({ ...auth }))
class Header extends React.Component {
    state = {
        selectedItem: 'log',
        navs: [
            {
                key: 'log',
                label: '日志',
                icon: 'profile',
            },
            {
                key: 'deploy',
                label: '部署',
                icon: 'cloud-upload',
            },
            {
                key: 'docs',
                label: '文档',
                icon: 'file-text',
            },
            {
                key: 'settings',
                label: '配置',
                icon: 'setting',
            },
        ],
    }

    UNSAFE_componentWillMount() {
        const selectedItem = window.location.hash.split('/')[1] || 'log';
        this.setState({
            ...this.state,
            selectedItem,
        });
    }

    handleClick = e => {
        if (this.state.selectedItem === e.key) return;
        this.setState({
            ...this.state,
            selectedItem: e.key,
        });
        this.props.dispatch(routerRedux.push(`/${e.key}`));
    }

    render() {
        return (
            <header className={styles.header}>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.selectedItem]} mode="horizontal" theme="dark">
                    {
                        this.state.navs.map(nav => {
                            return (
                                <MenuItem key={nav.key}>
                                    <Icon type={nav.icon} />{nav.label}
                                </MenuItem>
                            );
                        })
                    }
                </Menu>
                {
                    this.props.user.isLogin ? 
                    (
                        <div className={styles.userInfo}>
                            <UserInfo/>
                        </div>
                    )
                    : null
                }
            </header>
        );
    }
};

export default Header;