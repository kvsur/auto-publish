import React from 'react';
import { Icon, Form, Input, Button, Modal, message } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;

@Form.create()
@connect()
class AddProject extends React.Component {
    state = {
        loading: false,
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, project) => {
            if (!err) {
                this.setState({
                    loading: true,
                });
                if (project.root === '/var/www/html/ai') {
                    project.root = '';
                }
                this.props.dispatch({
                    type: 'projects/addProject',
                    payload: {
                        ...project,
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
        this.props.config.onCancel('showAddProject');
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
                    <FormItem>
                        {getFieldDecorator('projectName', {
                            rules: [{ required: true, message: 'projectName' }],
                        })(
                            <Input
                                prefix={<Icon type="project" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="项目名称"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('projectKey', {
                            rules: [{ required: true, message: 'projectKey' }],
                        })(
                            <Input
                                prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="projectKey"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('root', {
                            rules: [{ message: 'root' }],
                            initialValue: '/var/www/html/ai'
                        })(
                            <Input
                                prefix={<Icon type="copyright" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="root"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('dist', {
                            rules: [{ required: true, message: 'dist' }],
                        })(
                            <Input
                                prefix={<Icon type="database" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="dist"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('packageWhere', {
                            rules: [{ required: true, message: 'packageWhere' }],
                            initialValue: 'znkf2b_webapp'
                        })(
                            <Input
                                prefix={<Icon type="export" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="packageWhere"
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default AddProject;
