import React from 'react';
import { connect } from 'dva';

import md2html from '../utils/md2html';
import styles from './DocDetail.less';
import { Modal, message } from 'antd';
import '../index.css';

const { confirm } = Modal;

const DocDetail = props => {
    return (
        <section className={styles.docDetail}>
            <div>
                <a onClick={() => props.onEdit()}>编辑</a>
                <a onClick={() => props.confirm(props.doc.docKey)}>删除</a>
            </div>
            <div className={styles.title}>
                {props.doc.docName}
            </div>
            <div className={styles.baseInfo}>
                <p><b>作者：</b>{props.doc.author}</p>
                <p><b>创建时间：</b>{props.doc.createTime}</p>
                <p><b>上次更新时间：</b>{props.doc.lastUpdateTime}</p>
                <p></p>
            </div>
            <div className={styles.mainContent}>
                <iframe
                    width="100%"
                    scrolling="yes"
                    height="100%"
                    frameBorder={0}
                    style={{ overflow: 'visible', height: '2322px' }}
                    seamless="seamless"
                    srcDoc={md2html(props.doc.content, true)}
                    title={props.doc.docKey}
                ></iframe>
            </div>
        </section>
    );
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        // del(docKey) {
        //     dispatch({
        //         type: 'doc/delDoc',
        //         payload: {
        //             docKey,
        //         },
        //         cb: res => {
        //             if (res.c === 200) {
        //                 message.success('可以了');
        //                 dispatch({
        //                     type: 'doc/fetchDocs'
        //                 });
        //             } else {
        //                 message.error(res.m);
        //             }
        //         }
        //     });
        // },

        confirm(docKey) {
            // () => props.del(props.doc.docKey)
            confirm({
                title: '删除文档？',
                content: '文档删除之后不可逆，无法找回，谨慎点',
                okText: '删除',
                cancelText: '算了',
                onOk: () => {
                    dispatch({
                        type: 'doc/delDoc',
                        payload: {
                            docKey,
                        },
                        cb: res => {
                            if (res.c === 200) {
                                message.success('可以了');
                                dispatch({
                                    type: 'doc/fetchDocs'
                                });
                            } else {
                                message.error(res.m);
                            }
                        }
                    });
                },
                onCancel() {},
            });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocDetail);