import React from 'react';
import { Table, Icon, Modal, message, Button } from 'antd';
import { connect } from 'dva';

import AddUser from '../components/AddUser';
import UpdateTableUser from '../components/UpdateTableUser';
import styles from './People.less';

const { confirm } = Modal;

@connect(({ auth, users }) => ({ self: auth.user, ...users }))
class People extends React.Component {
    state = {
        user: {
            role: 'monkey-coder',
        },
        updateUser: {},
        roles: [
            {
                value: 'big-boss',
                key: 'big-boss',
            },
            {
                value: 'monkey-coder',
                key: 'monkey-coder',
            }
        ],
        showAdd: false,
        loading: false,
        showUpdate: false,
    }
    UNSAFE_componentWillMount() {
        this.update();
    }
    update() {
        this.props.dispatch({  type: 'users/fetchUsers' });
    }
    handleDelete(_id) {
        confirm({
            title: '账户删除？',
            content: '账户删除之后不可逆，无法找回，谨慎点',
            okText: '删除',
            cancelText: '算了',
            onOk: () => {
                this.props.dispatch({
                    type: 'users/deleteUser',
                    payload: {
                        _id,
                    },
                    cb: res => {
                        if (res.c === 200) {
                            message.success('可以了');
                            this.props.dispatch({
                                type: 'users/fetchUsers'
                            });
                        } else {
                            message.error(res.m);
                        }
                    }
                });
            },
            onCancel() {},
        });
    }
    handleRoleChange = role => {
        this.setState({
            user: {
                ...this.state.user,
                role,
            }
        });
    }
    addUser = () => {
        this.setState({
            showAdd: true,
        });
    }
    onOk = values => {
        values.role = this.state.user.role;
        this.setState({
            loading: true,
        });

        this.props.dispatch({
            type: 'users/addUser',
            payload: {
                ...values,
            },
            cb: res => {
                this.setState({
                    loading: false,
                });
                if (res.c === 200) {
                    message.success('可以了');
                    this.onCancel();
                    this.props.dispatch({ type: 'users/fetchUsers' });
                    return;
                }
                message.error(res.m);
            }
        });
    }
    onCancel = () => {
        this.setState({
            showAdd: false,
            showUpdate: false,
        });
    }
    updateInfo = user => {
        if (this.props.self.role !== 'admin' || this.props.self.account === user.account) return;
        this.setState({
            showUpdate: true,
            updateUser: user,
        });

    }
    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: '_id',
            },
            {
                title: '名_',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '账户',
                dataIndex: 'account',
                key: 'account',
            }, 
            {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
            },
            {
                title: '密码',
                dataIndex: 'password',
                key: 'password',
            },
            {
                title: 'XO',
                key: 'XO',
                render: (text, record) => (
                    (
                        record.role !== 'big-boss' || 
                        this.props.self.role === 'admin') && 
                        this.props.self.account !== record.account && record.role !== 'admin'
                        ?
                    (
                        <Icon
                        type="user-delete"
                        style={{ fontSize: '20px', color: 'red' }}
                    />
                    ): null
                )
            }
        ];
        return (
            <div className={styles.people}>
                <Button onClick={this.addUser} style={{ backgroundColor: '#3500b7c7', borderColor: '#3500b7c7', color: '#ffffff'}}>添加账户</Button>
                <Table
                    dataSource={this.props.users}
                    columns={columns}
                    locale={{ emptyText: '人力匮乏' }}
                    pagination={false}
                    rowKey={record => record._id}
                    onRow={
                        record => {
                            return {
                                onClick: e => {
                                    this.updateInfo(record);
                                }
                            };
                        }
                    }
                />
                <AddUser
                    config={
                        {
                            title: '添加账户',
                            width: 500,
                            visible: this.state.showAdd,
                            onOk: this.onOk,
                            onCancel: this.onCancel,
                        }
                    }
                    loading={this.state.loading}
                    handleRoleChange={this.handleRoleChange}
                    defaultValue={this.state.user.role}
                    roles={this.state.roles}
                />
               {
                   this.state.showUpdate ? 
                   (
                        <UpdateTableUser 
                            config={
                                {
                                    title: '添加账户',
                                    width: 300,
                                    visible: this.state.showUpdate,
                                    onCancel: this.onCancel,
                                }
                            }
                            roles={this.state.roles}
                            user={this.state.updateUser}
                            update={() => this.update()}
                            del={_id => {this.onCancel(); this.handleDelete(_id);}}
                        />
                   ) : null
               }
            </div>
        );
    }
}

export default People;
