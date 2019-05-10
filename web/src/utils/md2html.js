import marked from 'marked';
import Prism from 'prismjs'; // 这里使用 ~1.14.0 版本，1.15 之后的版本有bug
import 'prismjs/themes/prism-okaidia.css';
import loadLanguages from 'prismjs/components/index';
import css from '../constant/code.css';

const styles = 
    `
        <link rel="stylesheet" ref="http://172.20.208.157/showdoc/Public/bootstrap/css/bootstrap.min.css"/>
        <style>${css}</style>
    `;

loadLanguages(['css', 'javascript', 'bash', 'git', 'java', 'json', 'less', 'markdown', 'php', 'python', 'jsx', 'tsx', 'scss', 'vim']);

const renderMarkdown = (md, needStyle) => {
    let html = marked(md, { breaks: true })
        .replace(/\<table/gi, '<table class="table table-bordered table-hover" border="0" cellspacing="0" cellpadding="0"');;
    if (needStyle) {
        html = styles + html;
    }
    
    if (/language-/.test(html)) {
        const container = document.createElement('div');
        container.innerHTML = html;
        Prism.highlightAllUnder(container);
        return container.innerHTML;
    }
    return html;
}

export default renderMarkdown;