import React from 'react';
import { connect } from 'dva';
import { Icon, Modal, message, Input } from 'antd';

import AddProject from '../components/AddProject';
import AddBroker from '../components/AddBroker';

import styles from './Project.less';

const confirm = Modal.confirm;
const TextArea = Input.TextArea;

@connect(({projects}) => ({...projects}))
class Project extends React.Component {
    state = {
        _id: '',
        showAddProject: false,
        showAddBroker: false,
    }
    UNSAFE_componentWillMount() {
        this.update();
    }
    update = () => {
        this.props.dispatch({
            type: 'projects/fetchProjects',
        });
    }
    toggleAdd = varlible => {
        this.setState({
            [varlible]: !this.state[varlible],
        });
    }
    deleteBroker = (_id, index) => {
        confirm({
            title: '删除券商？',
            content: '配置删除之后不可逆，无法找回，谨慎点',
            okText: '删除',
            cancelText: '算了',
            onOk: () => {
                this.props.dispatch({
                    type: 'projects/deleteBroker',
                    payload: {
                        _id,
                        index,
                    },
                    cb: res => {
                        if (res.c === 200) {
                            message.success('可以了');
                            this.update();
                        } else {
                            message.error(res.m);
                        }
                    }
                });
            },
        });
    }
    deleteProject = _id => {
        confirm({
            title: '删除项目配置？',
            content: '配置删除之后不可逆，无法找回，谨慎点',
            okText: '删除',
            cancelText: '算了',
            onOk: () => {
                this.props.dispatch({
                    type: 'projects/deleteProject',
                    payload: {
                        _id,
                    },
                    cb: res => {
                        if (res.c === 200) {
                            message.success('可以了');
                            this.update();
                        } else {
                            message.error(res.m);
                        }
                    }
                });
            },
        });
    }
    showBrokerShell(broker) {
        confirm({
            title: broker.brokerName,
            content: <TextArea 
                    style={{fontSize: '16px'}} 
                    // autosize={{minRows: 7, maxRows: 15}} 
                    disabled
                    defaultValue={broker.brokerShell}
                    autosize={{minRows: 8}}
                />,
            okText: '确认',
            cancelText: '取消',
            // style: {width: '500px'},
            width: 650,
        });
    }
    render () {
        return (
            <section className={styles.projects}>
                {
                    this.props.projects ? this.props.projects.map(project => (
                        <div key={project._id}>
                            <div>
                                <h3>{project.projectName}</h3>
                                <p><label>_id: </label><span>{project._id}</span></p>
                                <p><label>root: </label><span>{project.root || '默认配置'}</span></p>
                                <p><label>dist: </label><span>{project.dist}</span></p>
                                <p><label>packageWhere: </label><span>{project.packageWhere}</span></p>
                                <p><label>projectKey: </label><span>{project.projectKey}</span></p>
                            </div>
                            <h4>项下券商</h4>
                            <div>
                                {
                                    project.brokers ? project.brokers.map((broker, index) => (
                                        <div key={broker.brokerName}>
                                            <p><label>brokerName: </label><span>{broker.brokerName}</span></p>
                                            <p><label>brokerKey: </label><span>{broker.brokerKey}</span></p>
                                            <a onClick={e => this.showBrokerShell(broker)}>点击查看附加shell</a>
                                            <Icon 
                                                type={'close'} 
                                                onClick={e => {this.deleteBroker(project._id, index)}} 
                                                className={styles.deleteProject}
                                            />
                                        </div>
                                    )) : null
                                }
                            </div>
                            <section>
                                <Icon type="plus"  title={'新增券商'}
                                    onClick={
                                        e => {
                                            this.setState({
                                                _id: project._id,
                                            });
                                            this.toggleAdd('showAddBroker')
                                        }
                                    }
                                />
                            </section>
                            <Icon type={'close'} onClick={e => {this.deleteProject(project._id)}} className={styles.deleteProject}/>
                        </div>
                    )): null
                }
                <section>
                    <Icon onClick={e => this.toggleAdd('showAddProject')} type="plus"  title={'新增项目'}/>
                </section>
                <AddProject
                    config={
                        {
                            title: '新增项目',
                            width: 400,
                            visible: this.state.showAddProject,
                            onCancel: this.toggleAdd,
                        }
                    }
                    update={this.update}
                />
                <AddBroker
                    config={
                        {
                            title: '新增券商',
                            width: 600,
                            visible: this.state.showAddBroker,
                            onCancel: this.toggleAdd,
                        }
                    }
                    update={this.update}
                    _id={this.state._id}
                />
            </section>
        );
    }
}

export default Project;
