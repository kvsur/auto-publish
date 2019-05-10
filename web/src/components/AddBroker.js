import React from 'react';
import { Icon, Form, Input, Button, Modal, message, Switch } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
@connect()
class AddBroker extends React.Component {
    state = {
        loading: false,
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, broker) => {
            if (!err) {
                this.setState({
                    loading: true,
                });
                this.props.dispatch({
                    type: 'projects/addBroker',
                    payload: {
                        _id: this.props._id,
                        broker
                    },
                    cb: res => {
                        this.setState({
                            loading: false,
                        });
                        if (res.c === 200) {
                            message.success('可以了');
                            this.cancel();
                            this.props.update();
                            return;
                        }
                        message.error(res.m);
                    }
                });
            } 
        });
    }

    cancel = () => {
        this.props.config.onCancel('showAddBroker');
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const style = { backgroundColor: '#3500b7c7', borderColor: '#3500b7c7' }, style2 = { borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff' };
        const footer = [
            <Button key="cancel" onClick={this.cancel} loading={this.state.loading} style={style2}>算了</Button>,
            <Button key="ok" type="primary" onClick={this.handleSubmit} loading={this.state.loading} style={style}>添加</Button>
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
                    <div style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between'}}>
                        <FormItem style={{width: '45%'}}>
                            {getFieldDecorator('brokerName', {
                                rules: [{ required: true, message: 'brokerName' }],
                            })(
                                <Input
                                    prefix={<Icon type="project" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="券商名称"
                                />
                            )}
                        </FormItem>
                        <FormItem style={{width: '45%'}}>
                            {getFieldDecorator('brokerKey', {
                                rules: [{ required: true, message: 'brokerKey' }],
                            })(
                                <Input
                                    prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="brokerKey"
                                />
                            )}
                        </FormItem>
                    </div>
                    <FormItem>
                        <h3>部署附加shell脚本</h3>
                            {getFieldDecorator('brokerShell', {
                                rules: [{ message: 'brokerShell' }],
                                initialValue: `#!/bin/bash\n# 这里是需要附加执行的shell脚本`
                            })(
                                <TextArea 
                                    style={{fontSize: '16px'}} 
                                    autosize={{minRows: 7, maxRows: 15}} 
                                    // onPressEnter={e => console.log(e.target.value)}
                                />
                            )}
                        
                    </FormItem>
                    <FormItem style={{width: '100%'}} label="生效脚本">
                        {getFieldDecorator('useShell')(
                            <Switch/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default AddBroker;
