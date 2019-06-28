import React from 'react';
import styles from './Auth.less';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Checkbox, Icon, message } from 'antd';

const FormItem = Form.Item;

@Form.create()
@connect(({auth}) => ({...auth}))
class Auth extends React.Component {
    state = {
        user: {
            account: '',
            password: '',
        },
    }

    UNSAFE_componentWillMount() {
        // if (this.props.user.isLogin) {
        //     this.props.dispatch(routerRedux.push('/'));
        //     return;
        // }
        const user = JSON.parse(window.localStorage.getItem('IDRTOMGP'));

        if (user) {
            this.setState({
                user,
            });
        }
        this.props.dispatch({
            type: 'auth/update',
            payload: {
                user: {
                    ...user,
                    isLogin: false,
                }
            }
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'auth/login',
                    payload: {
                        account: values.account,
                        password: values.password,
                    },
                    cb: res => {
                        if (res.c === 200) {
                            if (values.remember) {
                                values.name = res.d.user.name;
                                values.role = res.d.user.role;
                                values.isLogin = true;
                                window.localStorage.setItem('IDRTOMGP', JSON.stringify(values));
                            } else {
                                window.localStorage.removeItem('IDRTOMGP');
                            }
                            window.localStorage.setItem('DRDDOPM_OF', JSON.stringify(res.d));
                            const route = window.sessionStorage.getItem('oqw50q5y') || '/';
                            this.props.dispatch(routerRedux.push(route));
                        } else {
                            message.error(res.m);
                        }
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <section className={styles.main}>
                <section className={styles.auth}>
                    <h3>南无阿弥陀佛</h3>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '邮箱' }],
                                initialValue: this.state.user.account
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    autoComplete="account"
                                    placeholder="输邮箱"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '密码' }],
                                initialValue: this.state.user.password,
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    autoComplete="password"
                                    placeholder="输密码，初始密码123456"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住密码</Checkbox>
                            )}
                        </FormItem>
                        <FormItem className={styles.submitBtnnnn}>
                            <Button type="primary" htmlType="submit" className="login-form-button">插入</Button>
                        </FormItem>
                    </Form>
                </section>
            </section>
        );
    }
}

export default Auth;
