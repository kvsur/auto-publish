export default 
`
    /**
     * okaidia theme for JavaScript, CSS and HTML
     * Loosely based on Monokai textmate theme by http://www.monokai.nl/
     * @author ocodia
     */
    html::-webkit-scrollbar{width:0px}
    code[class*="language-"],
    pre[class*="language-"] {
        color: #f8f8f2;
        background: none;
        text-shadow: 0 1px rgba(0, 0, 0, 0.3);
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;

        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;

        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
    }

    /* Code blocks */
    pre[class*="language-"] {
        padding: 1em;
        margin: .5em 0;
        overflow: auto;
        border-radius: 0.3em;
    }

    :not(pre) > code[class*="language-"],
    pre[class*="language-"] {
        background: #272822;
    }

    /* Inline code */
    :not(pre) > code[class*="language-"] {
        padding: .1em;
        border-radius: .3em;
        white-space: normal;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: slategray;
    }

    .token.punctuation {
        color: #f8f8f2;
    }

    .namespace {
        opacity: .7;
    }

    .token.property,
    .token.tag,
    .token.constant,
    .token.symbol,
    .token.deleted {
        color: #f92672;
    }

    .token.boolean,
    .token.number {
        color: #ae81ff;
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
        color: #a6e22e;
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string,
    .token.variable {
        color: #f8f8f2;
    }

    .token.atrule,
    .token.attr-value,
    .token.function {
        color: #e6db74;
    }

    .token.keyword {
        color: #66d9ef;
    }

    .token.regex,
    .token.important {
        color: #fd971f;
    }

    .token.important,
    .token.bold {
        font-weight: bold;
    }
    .token.italic {
        font-style: italic;
    }

    .token.entity {
        cursor: help;
    }

    table {
        max-width: 100%;
        background-color: transparent;
        border-collapse: collapse;
        border-spacing: 0
    }

    .table {
        width: 100%;
        margin-bottom: 20px
    }

    .table th,.table td {
        padding: 8px;
        line-height: 20px;
        text-align: left;
        vertical-align: top;
        border-top: 1px solid #ddd
    }

    .table th {
        font-weight: bold
    }

    .table thead th {
        vertical-align: bottom
    }

    .table caption+thead tr:first-child th,.table caption+thead tr:first-child td,.table colgroup+thead tr:first-child th,.table colgroup+thead tr:first-child td,.table thead:first-child tr:first-child th,.table thead:first-child tr:first-child td {
        border-top: 0
    }

    .table tbody+tbody {
        border-top: 2px solid #ddd
    }

    .table .table {
        background-color: #fff
    }

    .table-condensed th,.table-condensed td {
        padding: 4px 5px
    }

    .table-bordered {
        border: 1px solid #ddd;
        border-collapse: separate;
        *border-collapse: collapse;
        border-left: 0;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px
    }

    .table-bordered th,.table-bordered td {
        border-left: 1px solid #ddd
    }

    .table-bordered caption+thead tr:first-child th,.table-bordered caption+tbody tr:first-child th,.table-bordered caption+tbody tr:first-child td,.table-bordered colgroup+thead tr:first-child th,.table-bordered colgroup+tbody tr:first-child th,.table-bordered colgroup+tbody tr:first-child td,.table-bordered thead:first-child tr:first-child th,.table-bordered tbody:first-child tr:first-child th,.table-bordered tbody:first-child tr:first-child td {
        border-top: 0
    }

    .table-bordered thead:first-child tr:first-child>th:first-child,.table-bordered tbody:first-child tr:first-child>td:first-child,.table-bordered tbody:first-child tr:first-child>th:first-child {
        -webkit-border-top-left-radius: 4px;
        border-top-left-radius: 4px;
        -moz-border-radius-topleft: 4px
    }

    .table-bordered thead:first-child tr:first-child>th:last-child,.table-bordered tbody:first-child tr:first-child>td:last-child,.table-bordered tbody:first-child tr:first-child>th:last-child {
        -webkit-border-top-right-radius: 4px;
        border-top-right-radius: 4px;
        -moz-border-radius-topright: 4px
    }

    .table-bordered thead:last-child tr:last-child>th:first-child,.table-bordered tbody:last-child tr:last-child>td:first-child,.table-bordered tbody:last-child tr:last-child>th:first-child,.table-bordered tfoot:last-child tr:last-child>td:first-child,.table-bordered tfoot:last-child tr:last-child>th:first-child {
        -webkit-border-bottom-left-radius: 4px;
        border-bottom-left-radius: 4px;
        -moz-border-radius-bottomleft: 4px
    }

    .table-bordered thead:last-child tr:last-child>th:last-child,.table-bordered tbody:last-child tr:last-child>td:last-child,.table-bordered tbody:last-child tr:last-child>th:last-child,.table-bordered tfoot:last-child tr:last-child>td:last-child,.table-bordered tfoot:last-child tr:last-child>th:last-child {
        -webkit-border-bottom-right-radius: 4px;
        border-bottom-right-radius: 4px;
        -moz-border-radius-bottomright: 4px
    }

    .table-bordered tfoot+tbody:last-child tr:last-child td:first-child {
        -webkit-border-bottom-left-radius: 0;
        border-bottom-left-radius: 0;
        -moz-border-radius-bottomleft: 0
    }

    .table-bordered tfoot+tbody:last-child tr:last-child td:last-child {
        -webkit-border-bottom-right-radius: 0;
        border-bottom-right-radius: 0;
        -moz-border-radius-bottomright: 0
    }

    .table-bordered caption+thead tr:first-child th:first-child,.table-bordered caption+tbody tr:first-child td:first-child,.table-bordered colgroup+thead tr:first-child th:first-child,.table-bordered colgroup+tbody tr:first-child td:first-child {
        -webkit-border-top-left-radius: 4px;
        border-top-left-radius: 4px;
        -moz-border-radius-topleft: 4px
    }

    .table-bordered caption+thead tr:first-child th:last-child,.table-bordered caption+tbody tr:first-child td:last-child,.table-bordered colgroup+thead tr:first-child th:last-child,.table-bordered colgroup+tbody tr:first-child td:last-child {
        -webkit-border-top-right-radius: 4px;
        border-top-right-radius: 4px;
        -moz-border-radius-topright: 4px
    }

    .table-striped tbody>tr:nth-child(odd)>td,.table-striped tbody>tr:nth-child(odd)>th {
        background-color: #f9f9f9
    }

    .table-hover tbody tr:hover>td,.table-hover tbody tr:hover>th {
        background-color: #f5f5f5
    }

    table td[class*="span"],table th[class*="span"],.row-fluid table td[class*="span"],.row-fluid table th[class*="span"] {
        display: table-cell;
        float: none;
        margin-left: 0
    }

    .table td.span1,.table th.span1 {
        float: none;
        width: 44px;
        margin-left: 0
    }

    .table td.span2,.table th.span2 {
        float: none;
        width: 124px;
        margin-left: 0
    }

    .table td.span3,.table th.span3 {
        float: none;
        width: 204px;
        margin-left: 0
    }

    .table td.span4,.table th.span4 {
        float: none;
        width: 284px;
        margin-left: 0
    }

    .table td.span5,.table th.span5 {
        float: none;
        width: 364px;
        margin-left: 0
    }

    .table td.span6,.table th.span6 {
        float: none;
        width: 444px;
        margin-left: 0
    }

    .table td.span7,.table th.span7 {
        float: none;
        width: 524px;
        margin-left: 0
    }

    .table td.span8,.table th.span8 {
        float: none;
        width: 604px;
        margin-left: 0
    }

    .table td.span9,.table th.span9 {
        float: none;
        width: 684px;
        margin-left: 0
    }

    .table td.span10,.table th.span10 {
        float: none;
        width: 764px;
        margin-left: 0
    }

    .table td.span11,.table th.span11 {
        float: none;
        width: 844px;
        margin-left: 0
    }

    .table td.span12,.table th.span12 {
        float: none;
        width: 924px;
        margin-left: 0
    }

    .table tbody tr.success>td {
        background-color: #dff0d8
    }

    .table tbody tr.error>td {
        background-color: #f2dede
    }

    .table tbody tr.warning>td {
        background-color: #fcf8e3
    }

    .table tbody tr.info>td {
        background-color: #d9edf7
    }

    .table-hover tbody tr.success:hover>td {
        background-color: #d0e9c6
    }

    .table-hover tbody tr.error:hover>td {
        background-color: #ebcccc
    }

    .table-hover tbody tr.warning:hover>td {
        background-color: #faf2cc
    }

    .table-hover tbody tr.info:hover>td {
        background-color: #c4e3f3
    }

    thead > tr {
        background-color: #3500b7c7;
        color: #fff;
    }

    img {
        width: 100%;
    }    
`;