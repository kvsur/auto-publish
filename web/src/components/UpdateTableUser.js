import React from 'react';
import { Form, Button, Select, Modal, message } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect()
class UpdateTableUser extends React.Component {
    state = {
        user: {},
        loading: false,
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true,
                });
                this.props.dispatch({
                    type: 'users/updateUserInfo',
                    payload: {
                        account: this.state.user.account,
                        role: this.state.user.role,
                    },
                    cb: res => {
                        this.setState({
                            loading: false,
                        });
                        if (res.c === 200) {
                            message.success('可以了');
                            this.props.config.onCancel();
                            this.props.update();
                            return;
                        }
                        message.error(res.m);
                    }
                });
            } 
        });
    }

    UNSAFE_componentWillMount() {
        this.setState({
            user: this.props.user,
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
    
    render() {
        const style = { backgroundColor: '#3500b7c7', borderColor: '#3500b7c7', color: '#fff'  }, style2 = { borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff' };
        const footer = [
            <Button key="cancel" onClick={this.props.config.onCancel} loading={this.state.loading} style={style}>算了</Button>,
            <Button key="del" onClick={e => this.props.del(this.state.user._id)} loading={this.state.loading} style={style2}>删除</Button>,
            <Button key="ok" onClick={this.handleSubmit} loading={this.state.loading} style={style2}>更新</Button>
        ];
        return (
            <Modal
                {...this.props.config}
                footer={footer}
                closable={false}
                destroyOnClose={true}
                maskClosable={false}
                keyboard={false}
            >
                <Form>
                    <FormItem>
                        <Select
                            onChange={this.handleRoleChange}
                            defaultValue={this.state.user.role}
                        >
                            {
                                this.props.roles.map(role => (
                                    <Option key={role.key || role.value} value={role.value}>{role.value}</Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default UpdateTableUser;
