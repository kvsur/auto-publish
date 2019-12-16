import React from 'react';
import { connect } from 'dva';
import { Table, DatePicker, Pagination, Divider, Form, Input } from 'antd';
import moment from 'moment';

import styles from './Log.less';

const Item = Form.Item;

const RangePicker = DatePicker.RangePicker;

const calcTime = time => new Date(time).toLocaleString('zh-CN',
    {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }
).replace(/\//g, '-');

@connect(({ logs }) => logs)
class Log extends React.Component {
    state = {
        params: {
            beginTime: calcTime((+new Date()) - (7 * 24 * 60 * 60 * 1000)),
            endTime: calcTime((+new Date())),
            projectName: '',
            brokerName: '',
            currentPage: 1,
            perPage: 20,
        },
        total: 0,
    };

    UNSAFE_componentWillMount() {
        this.getList();
    }
    getList = () => {
        const { params: { beginTime, endTime, projectName, brokerName, currentPage, perPage} } = this.state;
        this.props.dispatch({
            type: 'logs/fetchLogs',
            payload: {
                beginTime: new Date(`${beginTime} 00:00:00`).getTime(),
                endTime: new Date(`${endTime} 23:59:59`).getTime(),
                projectName, brokerName, currentPage, perPage
            }
        }).then(total => {
            this.setState({
                total
            });
        });
    }
    onChange = (_, dateString) => {
        let [beginTime, endTime] = dateString;
        beginTime = beginTime || calcTime((+new Date()) - (7 * 24 * 60 * 60 * 1000));
        endTime = endTime || calcTime(+new Date())

        this.setState({
            params: {
                ...this.state.params,
                beginTime, endTime,
                currentPage: 1,
            }
        }, () => {
            this.getList();
        });
    }

    currentChange = currentPage => {
        this.setState({
            params: {
                ...this.state.params,
                currentPage,
            }
        }, () => {
            this.getList();
        })
    }

    sizeChange = (_, perPage) => {
        this.setState({
            params: {
                ...this.state.params,
                perPage,
                currentPage: 1
            }
        }, () => {
            this.getList();
        })
    }

    handleNameChange = (value, key) => {
        this.setState({
            params: {
                ...this.state.params,
                [key]: value,
                currentPage: 1,
            }
        })
    }
    render() {
        const columns = [
            {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
            },
            {
                title: '券商名称',
                dataIndex: 'brokerName',
                key: 'brokerName',
            },
            {
                title: 'SVN版本号',
                dataIndex: 'svnVersion',
                key: 'svnVersion',
            },
            {
                title: '发布时间',
                dataIndex: 'deployTime',
                key: 'deployTime',
            },
            {
                title: '是否为trunk包',
                dataIndex: 'isTrunk',
                key: 'isTrunk',
                render: isTrunk => isTrunk ? <span style={{ color: '#1890ff' }}>是</span> : '否'
            },
            {
                title: '部署结果',
                dataIndex: 'result',
                key: 'result',
                render: result => result ? <span style={{ color: '#1890ff' }}>成功</span> : <span style={{ color: '#ff0000' }}>失败</span>
            },
            {
                title: 'DPeople',
                dataIndex: 'operator',
                key: 'operator',
            },
            {
                title: '错误信息',
                dataIndex: 'error',
                key: 'error',
                render: error => <span style={{ color: '#ff0000' }}>{error}</span>
            },
        ];

        const { params: { beginTime, endTime, projectName, brokerName, currentPage, perPage }, total } = this.state;

        return (
            <section className={styles.logPanel}>
                <Divider />
                {/* <div className={styles.logDatePicker}>
                    
                </div> */}
                <Form
                    className={styles.form}
                    layout="inline"
                >
                    <Item label="项目名">
                        <Input
                            value={projectName}
                            onChange={e => {this.handleNameChange(e.target.value, 'projectName')}}
                            onBlur={this.getList}
                            onPressEnter={this.getList}/>
                    </Item>
                    <Item label="券商名">
                        <Input
                            vlaue={brokerName}
                            onChange={e => {this.handleNameChange(e.target.value, 'brokerName')}}
                            onBlur={this.getList}
                            onPressEnter={this.getList}/>
                    </Item>
                    <Item label="日期">
                        <RangePicker value={[moment(beginTime), moment(endTime)]} onChange={this.onChange} />
                    </Item>
                    <Item>
                        <Pagination
                            size="small"
                            pageSizeOptions={['20', '40', '80', '100']}
                            showSizeChanger={true}
                            // showTotal={true}
                            total={total}
                            current={currentPage}
                            pageSize={perPage}
                            onChange={this.currentChange}
                            onShowSizeChange={this.sizeChange} />
                    </Item>
                </Form>
                <Table
                    dataSource={this.props.logs}
                    columns={columns}
                    locale={{ emptyText: '当前过滤条件下没有发包部署记录' }}
                    pagination={false}
                />
                <Pagination
                    style={{textAlign: 'right', margin: '20px auto'}}
                    size="small"
                    pageSizeOptions={['20', '40', '80', '100']}
                    showSizeChanger={true}
                    // showTotal={true}
                    total={total}
                    current={currentPage}
                    pageSize={perPage}
                    onChange={this.currentChange}
                    onShowSizeChange={this.sizeChange} />
            </section>
        );
    }
}

export default Log;