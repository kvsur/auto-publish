import React from 'react';
import { connect } from 'dva';
import { Select, Form, Switch, Divider, Button, Tag, Pagination, Modal } from 'antd';

import color from '../utils/Color';
import DeployInfo from '../components/DeployInfo';
import Report from '../components/Report';

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
            selfDist: '',
        },
        brokers: [],
        canSwitch: false,
        projectIndex: -1,
        showBrokerValue: undefined,
        currentPage: 1,
        visible: false,
        errorMsg: '',
        loading: false,
        showBtn: true,
        id: '',
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
        const { deployConfig } = this.state;
        const [ projectKey, index ] = project.split('||');
        if (deployConfig.projectKey === projectKey) return;
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
        const { deployConfig } = this.state;
        const [ brokerName, brokerKey, _brokerId, selfDist ] = broker.split('||');
        if (brokerKey === deployConfig.brokerKey && brokerName === deployConfig.brokerName) return;
        this.setState({
            canSwitch: true,
            deployConfig: {
                ...deployConfig,
                brokerKey,
                brokerName,
                _brokerId,
                selfDist
            },
            showBrokerValue: brokerName,
        });
        this.clearVersions();
    }

    switchChange = isTrunk => {
        const { deployConfig } = this.state;
        if (deployConfig.isTrunk === isTrunk) return;
        this.setState({
            deployConfig: {
                ...deployConfig,
                isTrunk,
            },
        });
        this.clearVersions();
    }

    getSVNversions = (currentPage) => {
        const { deployConfig } = this.state;
        this.props.dispatch({
            type: 'deploy/getSVNversions',
            payload: {
                packageWhere: deployConfig.packageWhere,
                currentPage,
                isTrunk: deployConfig.isTrunk,
            },
        });
    }

    pageChange = page => {
        this.getSVNversions(page);
    }

    onOk = () => {
        const { deployConfig, id } = this.state;
        const { dist, selfDist } = deployConfig;
        this.setState({
            loading: true,
        });
        this.props.dispatch({
            type: 'deploy/deploy',
            payload: {
                ...deployConfig,
                dist: selfDist || dist,
                operator: this.props.operator,
                id
            },
            cb: res => {
                if (res.c === 200) {
                    this.setState({
                        showBtn: false,
                    });
                    // message.success('部署成功');
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
            showBtn: true,
        });
    }

    deploy(svnVersion) {
        const { deployConfig } = this.state;
        const { _projectId, _brokerId, svnVersion: version } = deployConfig;
        this.setState({
            deployConfig: {
                ...deployConfig,
                svnVersion,
            },
            id: _projectId + _brokerId + version + (+new Date()),
        }, () => {
            this.setState({
                visible: true,
            })
        });
    }

    render() {
        const { showBtn, deployConfig, visible, loading, errorMsg, showBrokerValue, brokers, projectIndex, canSwitch, currentPage, id } = this.state;
        const style = {backgroundColor: '#3500b7c7', borderColor: '#3500b7c7'}, style2 = {borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff'};
        const footer = [
            <Button key="cancel" onClick={this.onCancel} style={style2}>算了</Button>,
            <Button key="ok" type="primary" loading={loading} onClick={this.onOk} style={style}>部署</Button>
        ];
        return (
            <section className={styles.deployContainer}>
                <Modal
                    title="确认部署？"
                    width={'50%'}
                    visible={visible}
                    loading={loading}
                    footer={showBtn ? footer: null}
                    onCancel={this.onCancel}
                    keyboard={false}
                    destroyOnClose
                    maskClosable={false}
                >
                    <DeployInfo
                        errorMsg={errorMsg}
                        projectName={deployConfig.projectName}
                        brokerName={deployConfig.brokerName}
                        isTrunk={deployConfig.isTrunk}
                        svnVersion={deployConfig.svnVersion}
                        id={id}
                    />
                </Modal>
                <Divider/>
                <Form layout="inline" className={styles.deployForm}>
                    <FormItem label="项目选择">
                        <Select style={{width: '200px'}} onSelect={this.handleSelectingProject} placeholder="选择项目">
                            {
                                this.props.projectConfig.map((project, index) => {
                                    return (
                                        <Option value={`${project.projectKey}||${index}`} key={`${project.projectKey}||${index}`}>{project.projectName}</Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="券商选择">
                        <Select onSelect={this.handleSelectingBroker} value={showBrokerValue} placeholder="选择券商" disabled={!~projectIndex} style={{width: '200px'}}>
                            {
                                brokers.map(broker => {
                                    return (
                                        <Option
                                            value={`${broker.brokerName}||${broker.brokerKey}||${broker._id}||${broker.dist || ''}`}
                                            key={`${broker.brokerName}||${broker.brokerKey}||${broker._id}||${broker.dist || ''}`}>
                                            {broker.brokerName}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="是否为trunk取包部署">
                            <Switch defaultChecked={false} checked={deployConfig.isTrunk} disabled={!canSwitch} onChange={this.switchChange}/>
                    </FormItem>
                    <FormItem>
                        <Button
                            disabled={!canSwitch}
                            onClick={() => {this.getSVNversions(currentPage)}}
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
                <Report />
            </section>
        );
    }
}

export default Deploy;