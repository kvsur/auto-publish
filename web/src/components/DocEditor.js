import React from 'react';
import PropTypes from 'prop-types';
import SimpleMDEEditor from 'yt-simplemde-editor';
import cookie from 'cookie';
import renderMarkdown from '../utils/md2html'; 

import { Modal, Button, Input, Icon } from 'antd';
import { connect } from 'dva';
@connect()
class DocEditor extends React.Component{
    state = {
        value: '',
        docName: '',
    }
    componentDidMount() {
        this.setState({
            value: this.props.doc.content,
            docName: this.props.doc.docName,
        });
        this.editorProps = {
            value: this.props.doc.content,
            getMdeInstance: simplemde => {
                return simplemde;
            },
            onChange: value => {
                this.setState({
                    value
                });
            },
            options: {
                // see https://github.com/sparksuite/simplemde-markdown-editor#configuration
                spellChecker: false,
                forceSync: true,
                autosave: {
                    enabled: true,
                    delay: 3000,
                    uniqueId: 'article_content',
                },
                renderingConfig: {
                    // codeSyntaxHighlighting: true,
                },
                previewRender: renderMarkdown, // 自定义预览渲染
                tabSize: 4,
                toolbar: [
                    'bold',
                    'italic',
                    'heading',
                    '|',
                    'quote',
                    'code',
                    'table',
                    'horizontal-rule',
                    'unordered-list',
                    'ordered-list',
                    '|',
                    'link',
                    'image',
                    '|',
                    'side-by-side',
                    'fullscreen',
                    '|',
                    {
                        name: 'guide',
                        action() {
                            const win = window.open(
                                'https://github.com/riku/Markdown-Syntax-CN/blob/master/syntax.md',
                                '_blank',
                            );
                            if (win) {
                                // Browser has allowed it to be opened
                                win.focus();
                            }
                        },
                        className: 'fa fa-info-circle',
                        title: 'Markdown 语法！',
                    },
                ],
            },
            uploadOptions: {
                uploadUrl: '/api/attachment/upload',
                jsonFieldName: 'data.filename',
                extraHeaders: {
                    Accept: 'application/x.sheng.v1+json',
                    'X-XSRF-TOKEN': cookie.parse(document.cookie)['XSRF-TOKEN'],
                    enctype: 'multipart/form-data',
                },
            },
        };
    }
    render() {
        const style = {backgroundColor: '#3500b7c7', borderColor: '#3500b7c7'}, style2 = {borderColor: '#da3c45', backgroundColor: '#da3c45', color: '#fff'};
        const footer = [
            <Button key="cancel" onClick={this.props.modalProps.onCancel} style={style2}>算了</Button>,
            <Button key="ok" type="primary" loading={this.props.modalProps.loading} onClick={() => this.props.modalProps.onOk(this.state.docName, this.state.value)} style={style}>包村</Button>
        ];
        // const 

        return (
            <Modal
                {...this.props.modalProps}
                footer={footer}
                closable={false}
                destroyOnClose={true}
                maskClosable={false}
                keyboard={false}>
                    <Input
                        style={{marginBottom: '20px'}}
                        placeholder="输入文档标题"
                        prefix={<Icon type="copy" />}
                        value={this.state.docName}
                        onChange={e => {this.setState({docName: e.target.value})}}
                    />
                    <SimpleMDEEditor ref='simpleMdeEditor' {...this.editorProps} />
            </Modal>
        );
    }
}

DocEditor.propTypes = {
    doc: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default DocEditor;