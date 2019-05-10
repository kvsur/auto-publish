import React from 'react';
import { connect } from 'dva';
import { Menu, Icon, message } from 'antd';
import DocDetail from '../components/DocDetail';
import DocEditor from '../components/DocEditor';

import styles from './Doc.less'

const MenuItem = Menu.Item;

@connect(({doc, auth}) => ({...doc, author: auth.user.name}))
class Doc extends React.Component {
	state = {
		doc: {
			author: '',
			docName: '',
			content: '',
		},
		showAddPanel: false,
		loading: false,
		currentIndex: 0,
	}

	UNSAFE_componentWillMount() {
		this.props.dispatch({
			type: 'doc/fetchDocs',
		});
	}

	handleAdd = () => {
		this.setState({
			doc: {
				author: this.props.author,
				docName: '',
				content: '',
			},
			showAddPanel: true,
		});
	}

	submit = (docName, content) => {
		this.setState({
			doc: {
				...this.state.doc,
				docName,
				content
			},
		}, () => {
			this.props.dispatch({
				type: 'doc/newDoc',
				payload: {
					...this.state.doc
				},
				cb: res => {
					if (res.c === 200) {
						this.setState({
							showAddPanel: false,
						});
						message.success('可以了');
						return;
					}
					message.error('有点问题，自己查吧');
				},
			});
		});
		
	}

	cancel = () => {
		this.setState({
			showAddPanel: false,
		});
	}

	handleChange = content => {
		this.setState({
			...this.state,
			doc: {
				...this.state.doc,
				content,
			},
		});
	}

	handleNameChange = docName => {
		this.setState({
			...this.state,
			doc: {
				...this.state.doc,
				docName,
			},
		});
	}

	handleEdit = () => {
		this.setState({
			doc: {
				...this.props.currentDetailDoc,
			},
			showAddPanel: true,
		});
	}

	handleItemClick = (doc, currentIndex) => {
		const { docKey } = doc;
		this.props.dispatch({
			type: 'doc/update',
			payload: {
				currentDetailDoc: {
					...this.props.currentDetailDoc,
					...doc,
				},
				currentIndex,
			}
		});
		this.props.dispatch({
			type: 'doc/fetchDoc',
			payload: {
				docKey,
			},
		});
	}

	render() {
		const modalProps = {
			title: this.state.doc.docKey ? `编辑文档` : '新增文档',
			width: 800,
			visible: this.state.showAddPanel,
			onOk: this.submit,
			onCancel: this.cancel,
			loading: this.state.loading,
		};
		return (
			<div className={styles.docContent}>
				{
					this.state.showAddPanel ? 
					(
						<DocEditor
							ref="docEditor"
							modalProps={modalProps}
							doc={this.state.doc}
							onChange={this.handleChange}
							onNameChange={this.handleNameChange}
						/>
					)
					: null
				}
				<Menu mode="inline" className={styles.docMenu} 
					defaultSelectedKeys={this.props.defaultSelectedKeys}>
					{
						this.props.docs.map((doc, index) => {
							return (
								<MenuItem key={doc.docKey} onClick={() => {
									this.handleItemClick(doc, index)
								}}>{doc.docName}</MenuItem>
							);
						})
					}
				</Menu>
				{
					this.props.currentDetailDoc.docName ? 
					(
						<DocDetail doc={this.props.currentDetailDoc} onEdit={this.handleEdit}/>
					) : null
				}
				<div className={styles.addBtn} title={`新增文档`} onClick={this.handleAdd}>
					<Icon type="plus" />
				</div>
			</div>
		);
	}
}

export default Doc;