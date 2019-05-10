import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';
const DeployModal = props => {
    const style = {backgroundColor: '#3500b7c7', borderColor: '#3500b7c7'}, style2 = {borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff'};
    const footer = [
        <Button key="cancel" onClick={props.onCancel} style={style2}>算了</Button>,
        <Button key="ok" type="primary" loading={props.loading} onClick={props.onOk} style={style}>部署</Button>
    ];
    return (
        <Modal {...props} footer={footer}>
            <p><b>项目：</b><span>{props.projectName}</span></p>
            <p><b>券商：</b><span>{props.brokerName}</span></p>
            <p><b>turnk：</b><span>{props.isTrunk ? '是' : '否'}</span></p>
            <p><b>版本号：</b><span>{props.svnVersion}</span></p>
            {
                props.errorMsg ? 
                (
                    <p style={{color: 'red'}}>{props.errorMsg}</p>
                ) : (
                    null
                )
            }
        </Modal>
    );
}

DeployModal.propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    projectName: PropTypes.string.isRequired,
    brokerName: PropTypes.string.isRequired,
    isTrunk: PropTypes.bool.isRequired,
    svnVersion: PropTypes.string.isRequired,
}

export default DeployModal;