const fs = require('fs');
const path = require('path');
const ObjectId = require('mongoose').Types.ObjectId;
const Doc = require('../models/Doc');

class DocUtil {
    static async delDoc({ docKey, response }) {
        try {
            await Doc.findOneAndDelete({ docKey });
            await fs.unlinkSync(`./doc/docs/${docKey}.md`);

            response.json({
                c: 200,
                m: '',
                d: docKey,
            });
        } catch (err) {
            response.json({
                c: 500,
                m: '删除文档失败',
                d: null,
            });
        }
    }

    static async getDoc({ docKey, response }) {
        try {
            const buffer = await fs.readFileSync(path.resolve(__dirname, `./docs/${docKey}.md`));
            response.json({
                c: 200,
                m: '',
                d: buffer && buffer.toString() || '',
            });
        } catch(err) {
            console.log(err);
            response.json({
                c: 500,
                m: '<span style="color: red;">文档不存在或无权限操作</span>',
                d: '',
            });
        }
    }

    static async getDocs({ response }) {
        let docs = null;
        try {
           docs = await Doc.find({}); 
        } catch(err) {
            docs = [];
        } finally {
            response.json({
                c: 200,
                m: '',
                d: docs.reverse(),
            });
        }
    }

    static async newDoc({ doc, response }) {
        doc.newDocKey = new ObjectId();
        const buffer = new Uint8Array(Buffer.from(doc.content));
        try {
            await fs.writeFileSync(path.resolve(__dirname, `./docs/${(doc.docKey || doc.newDocKey).toString()}.md`), buffer);
            if (doc.docKey) {
                const { docKey } = doc;
                const lastUpdateTime = new Date().toLocaleString('zh-CN', {hour12: false});
                await Doc.findOneAndUpdate({ docKey }, { lastUpdateTime });
            } else {
                const newDoc = new Doc({
                    docName: doc.docName,
                    author: doc.author,
                    docKey: doc.newDocKey,
                });
                await newDoc.save();
            }

            response.json({
                c: 200,
                m: '保存文档成功',
                d: doc
            });
        } catch (err) {
            response.json({
                c: 500,
                m: '保存文档失败',
                d: null
            });
        }
    }
}

module.exports = DocUtil;
