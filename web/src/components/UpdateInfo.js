import React from 'react';
import { Modal, Button, Form, Input, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@Form.create()
@connect()
class UpdateInfo extends React.Component {
    state = {
        type: 'password',
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.config.onOk(values);
            } 
        });
    }

    handleMousedown = e => {
        e.preventDefault();
        this.setState({
            type: 'user'
        });
    }

    handleMouseup = e => {
        e.preventDefault();
        this.setState({
            type: 'password'
        });
    }
    
    render() {
        const style = { backgroundColor: '#3500b7c7', borderColor: '#3500b7c7' }, style2 = { borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff' };
        const footer = [
            <Button key="cancel" onClick={this.props.config.onCancel} style={style2}>算了</Button>,
            <Button key="ok" type="primary" onClick={this.handleSubmit} style={style}>更新</Button>
        ];
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                {...this.props.config}
                footer={footer}
                closable={false}
                destroyOnClose={true}
                maskClosable={false}
                keyboard={false}
            >
                <Form className="login-form">
                    <FormItem>
                        {getFieldDecorator('name', {
                            rules: [{ message: '名称' }],
                            initialValue: this.props.name,
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type='user'
                                placeholder="名称"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ message: '密码' }],
                            initialValue: '',
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type={this.state.type}
                                placeholder="密码"
                                addonAfter={<Icon type="eye" style={{cursor: 'pointer'}} onMouseDown={this.handleMousedown} onMouseUp={this.handleMouseup}/>}
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default UpdateInfo;