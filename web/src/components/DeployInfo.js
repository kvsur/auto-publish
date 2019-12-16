import PropTypes from 'prop-types';
import React from 'react';
import styles from './DeployModal.less';
// import { throttle } from 'lodash'

class DeployInfo extends React.Component {
    state = {
        msgs: []
    };

    socket = null;

    componentDidMount() {
        this.setState({
            msgs: []
        });
        this.socket = new WebSocket(`ws://${window.location.host}/deploy_socket`);
        this.socket.onmessage = e => {
            const { messageType, data } = JSON.parse(e.data);
            if (messageType === 'deploy-message') {
                const {msgs} = this.state;
                msgs.push(data);
                this.setState({
                    msgs
                }, () => {
                    setTimeout(() => {
                        this.scrollTopBottom();
                    }, 100);
                });
            }
        }
        this.socket.onopen = () => {
            this.socket.send(JSON.stringify({
                messageType: 'login',
                id: this.props.id,
                data: ''
            }));
        }
    }

    componentWillUnmount() {
        if (this.socket !== null) {
            this.socket.send(JSON.stringify({
                messageType: 'logout',
                id: this.props.id,
                data: ''
            }));
            this.socket.close();
            this.socket = null;
        }
    }

    doAnimation() {
        const container = document.getElementById('message_panel');
        const height = window.parseInt(window.getComputedStyle(container).height.split('px')[0])
        if (height < 500) return;
        const theEnd = container.scrollHeight - container.offsetHeight;
        container.scrollTop = container.scrollTop + 5;

        if (container.scrollTop < theEnd) {
            window.requestAnimationFrame(() => {this.doAnimation()})
        }
    }

    scrollTopBottom() {
        window.requestAnimationFrame(() => {this.doAnimation()});
    }

    render() {
        const { projectName, brokerName, isTrunk, svnVersion, errorMsg } = this.props;
        const { msgs } = this.state;
        return (
            <div>
                <div className={styles.deployInfo}>
                    <p><b>项目：</b><span>{projectName}</span></p>
                    <p><b>券商：</b><span>{brokerName}</span></p>
                    <p><b>trunk部署：</b><span>{isTrunk ? '是' : '否'}</span></p>
                    <p><b>版本号：</b><span>{svnVersion}</span></p>
                </div>
                <div id="message_panel" className={styles.messagePanel}>
                    {
                        msgs.map(({type, info}, index) => (
                            <p key={index} className={styles[type + '-item']}><span className={styles['user-item']}>{`root@znkf-front-end: `}</span>{info}</p>
                        ))
                    }
                </div>
                {
                    errorMsg ? 
                    (
                        <p style={{color: 'red'}}>{errorMsg}</p>
                    ) : (
                        null
                    )
                }
            </div>
        );
    }
}

DeployInfo.propTypes = {
    projectName: PropTypes.string.isRequired,
    brokerName: PropTypes.string.isRequired,
    isTrunk: PropTypes.bool.isRequired,
    svnVersion: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
}

export default DeployInfo;