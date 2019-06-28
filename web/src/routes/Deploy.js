import React from 'react';
import { connect } from 'dva';
import { Select, Form, Switch, Divider, Button, Tag, message, Pagination } from 'antd';

import color from '../utils/Color';
import DeployModal from '../components/DeployModal';

import styles from './Deploy.less';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({deploy, auth}) => ({ ...deploy, operator: auth.user.name }))
class Deploy extends React.Component {
    state = {
        deployConfig: {
            root: '',
            packageWhere: '',
            dist: '',
            isTrunk: false,
            svnVersion: '',
            projectKey: '',
            projectName: '',
            brokerKey: '',
            brokerName: '',
        },
        brokers: [],
        canSwitch: false,
        projectIndex: -1,
        showBrokerValue: undefined,
        currentPage: 1,
        visible: false,
        errorMsg: '',
        loading: false,
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch({
            type: 'deploy/update',
            payload: {
                versions: [],
            },
        });
        this.props.dispatch({
            type: 'deploy/getConfig',
        });
    }

    clearVersions() {
        this.props.dispatch({
            type: 'deploy/update',
            payload: {
                versions: []
            },
        });
    }

    handleSelectingProject = project => {
        const [ projectKey, index ] = project.split('-');
        if (this.state.deployConfig.projectKey === projectKey) return;
        project = this.props.projectConfig[index];
        const brokers = project.brokers;
        this.setState({
            brokers,
            showBrokerValue: undefined,
            canSwitch: false,
            projectIndex: parseInt(index, 10),
            deployConfig: {
                // update
                packageWhere: project.packageWhere,
                dist: project.dist,
                _projectId: project._id,
                projectKey,
                projectName: project.projectName,
                root: project.root,

                // will update, keep
                isTrunk: false,
                svnVersion: '',
                brokerKey: '',
                brokerName: '',
            }
        });
        this.clearVersions();
    }

    handleSelectingBroker = broker => {
        const [ brokerName, brokerKey, _brokerId ] = broker.split('-');
        if (brokerKey === this.state.deployConfig.brokerKey && brokerName === this.state.deployConfig.brokerName) return;
        this.setState({
            canSwitch: true,
            deployConfig: {
                ...this.state.deployConfig,
                brokerKey,
                brokerName,
                _brokerId,
            },
            showBrokerValue: brokerName,
        });
        this.clearVersions();
    }

    switchChange = isTrunk => {
        if (this.state.deployConfig.isTrunk === isTrunk) return;
        this.setState({
            deployConfig: {
                ...this.state.deployConfig,
                isTrunk,
            },
        });
        this.clearVersions();
    }

    getSVNversions = (currentPage) => {
        this.props.dispatch({
            type: 'deploy/getSVNversions',
            payload: {
                packageWhere: this.state.deployConfig.packageWhere,
                currentPage,
                isTrunk: this.state.deployConfig.isTrunk,
            },
        });
    }

    pageChange = page => {
        this.getSVNversions(page);
    }

    onOk = () => {
        this.setState({
            loading: true,
        });
        this.props.dispatch({
            type: 'deploy/deploy',
            payload: {
                ...this.state.deployConfig,
                operator: this.props.operator,
            },
            cb: res => {
                if (res.c === 200) {
                    this.setState({
                        visible: false,
                    });
                    message.success('部署成功');
                } else {
                    this.setState({
                        errorMsg: `后端挂了` + res.m,
                    });
                }
                this.setState({
                    loading: false
                });
            },
        });;
    }

    onCancel = () => {
        this.setState({
            visible: false,
            errorMsg: '',
            loading: false,
        });
    }

    deploy(svnVersion) {
        this.setState({
            deployConfig: {
                ...this.state.deployConfig,
                svnVersion,
            },
            visible: true,
        });
    }

    render() {
        return (
            <section className={styles.deployContainer}>
                <DeployModal
                    title="确认部署？"
                    width={300}
                    visible={this.state.visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    loading={this.state.loading}
                    errorMsg={this.state.errorMsg}
                    projectName={this.state.deployConfig.projectName}
                    brokerName={this.state.deployConfig.brokerName}
                    isTrunk={this.state.deployConfig.isTrunk}
                    svnVersion={this.state.deployConfig.svnVersion}
                />
                <Divider/>
                <Form layout="inline" className={styles.deployForm}>
                    <FormItem label="项目选择">
                        <Select style={{width: '200px'}} onSelect={this.handleSelectingProject} placeholder="选择项目">
                            {
                                this.props.projectConfig.map((project, index) => {
                                    return (
                                        <Option value={`${project.projectKey}-${index}`} key={`${project.projectKey}-${index}`}>{project.projectName}</Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="券商选择">
                        <Select onSelect={this.handleSelectingBroker} value={this.state.showBrokerValue} placeholder="选择券商" disabled={!~this.state.projectIndex} style={{width: '200px'}}>
                            {
                                this.state.brokers.map(broker => {
                                    return (
                                        <Option value={`${broker.brokerName}-${broker.brokerKey}-${broker._id}`} key={`${broker.brokerName}-${broker.brokerKey}-${broker._id}`}>{broker.brokerName}</Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="是否为trunk取包部署">
                            <Switch defaultChecked={false} checked={this.state.deployConfig.isTrunk} disabled={!this.state.canSwitch} onChange={this.switchChange}/>
                    </FormItem>
                    <FormItem>
                        <Button
                            disabled={!this.state.canSwitch}
                            onClick={() => {this.getSVNversions(this.state.currentPage)}}
                            style={{borderColor: '#963cda', backgroundColor: '#963cda', color: '#fff'}}>
                            查询
                        </Button>
                    </FormItem>
                </Form>
                <Divider/>
                <section className={styles.versionPanel}>
                    {
                        this.props.versions.map(version => {
                            return (
                                <Tag color={color.hex()} key={version} onClick={() => {this.deploy(version)}}>{version}</Tag>
                            );
                        })
                    }
                    {
                        this.props.versions.length > 0 ? 
                        (
                            <div>
                                <Divider/>
                                <Pagination defaultCurrent={1} total={this.props.totalCounts} pageSize={this.props.pagePer} onChange={this.pageChange} size="small"/>
                            </div>
                        )
                        : null
                    }
                </section>
            </section>
        );
    }
}

export default Deploy;