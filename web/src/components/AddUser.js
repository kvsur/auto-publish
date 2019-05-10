import React from 'react';
import { Icon, Form, Input, Button, Select, Modal } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect()
class AddUser extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.config.onOk(values);
            } 
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const style = { backgroundColor: '#3500b7c7', borderColor: '#3500b7c7' }, style2 = { borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff' };
        const footer = [
            <Button key="cancel" onClick={this.props.config.onCancel} loading={this.props.loading} style={style2}>算了</Button>,
            <Button key="ok" type="primary" onClick={this.handleSubmit} loading={this.props.loading} style={style}>添加</Button>
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
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '名称' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="输名称"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('account', {
                            rules: [{ required: true, message: '邮箱', type: 'email' }],
                        })(
                            <Input
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="输邮箱"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '密码' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="输密码"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        <Select
                            onChange={this.props.handleRoleChange}
                            defaultValue={this.props.defaultValue}
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

export default AddUser;
