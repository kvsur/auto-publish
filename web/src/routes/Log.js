import React from 'react';
import { connect } from 'dva';
import { Table, DatePicker, message, Divider } from 'antd';

import styles from './Log.less';

const today = () => new Date().toLocaleString('zh-CN',
    {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }
).replace(/\//g, '-');

@connect(({ logs }) => logs)
class Log extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch({
            type: 'logs/fetchLogs',
            payload: {
                date: today(),
            }
        });
    }
    onChange = (date, dateString) => {
        if ((new Date(dateString)) > (new Date(today()))) {
            message.error(
                '你不知道今天之后的日期不能选么?',
                3
            );
            return;
        }
        this.props.dispatch({
            type: 'logs/fetchLogs',
            payload: {
                date: dateString,
            },
        });
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

        return (
            <section className={styles.logPanel}>
                <Divider />
                <div className={styles.logDatePicker}>
                    <DatePicker onChange={this.onChange} size="" style={{ width: '282px' }} />
                </div>
                <Divider />
                <Table
                    dataSource={this.props.logs}
                    columns={columns}
                    locale={{ emptyText: '今天没有发包部署记录' }}
                    pagination={false}
                />
            </section>
        );
    }
}

export default Log;