import React from 'react';
import { connect } from 'dva';
// import { Form, Menu, Icon, message } from 'antd';
import { Menu } from 'antd';
import { Route, routerRedux } from 'dva/router';

import styles from './Setting.less';

import People from './People';
import Project from './Project';

// const FormItem = Form.Item;
const MenuItem = Menu.Item;

const components = {
    'people': People,
    'project': Project,
};

@connect(({auth}) => ({user: auth.user}))
class Setting extends React.Component {
    state = {
        route: 'project'
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(routerRedux.push(`${this.props.match.path}/project`));
    }

    handleMenuClick = ({ key }) => {
        if (this.state.route === key) return;
        this.props.dispatch(routerRedux.push(`${this.props.match.path}/${key}`));
        this.setState({
            route: key,
        });
    }
    render() {
        return (
            <section className={styles.setting}>
                <Menu mode="inline" className={styles.settingMenu}
                    defaultSelectedKeys={['project']}>
                    <MenuItem key={'project'} onClick={this.handleMenuClick}>项目配置</MenuItem>
                    <MenuItem key={'people'} onClick={this.handleMenuClick}>账户管理</MenuItem>
                </Menu>
                <div className={styles.mainContent}>
                    {
                        this.props.user.role === 'big-boss' || this.props.user.role === 'admin' ?
                        (
                            <Route exact path={this.props.match.path+'/:settingItem'} component={components[this.state.route]} />
                        ) : (
                            <div className={styles.addUserBtn}>
                                当前账户没有配置操作的权限
                            </div>
                        )
                    }
                </div>
            </section>
        );
    }
}

export default Setting;