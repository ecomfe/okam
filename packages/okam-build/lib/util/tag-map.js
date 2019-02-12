/**
 * @file Default tag transformation map
 * @author sparklewhy@gmail.com
 */

'use strict';

exports.h5ToMiniProgram = {
    div: 'view',
    p: 'view',
    ul: 'view',
    ol: 'view',
    li: 'view',
    // span 会被转为 view 标签，若想让它拥有 inline 属性，可通过 配置 class 值
    // 如：okam-inline 进行 样式属性控制
    // 注：okam-inline 样式 需自行在样式文件(app.css)中定义
    // 最终 view 标签 class 将额外添加 okam-inline 值，而不是覆盖
    span: {
        tag: 'view',
        class: 'okam-inline'
    },
    strong: {
        tag: 'view',
        class: 'okam-inline'
    },
    h1: 'view',
    h2: 'view',
    h3: 'view',
    h4: 'view',
    h5: 'view',
    h6: 'view',
    article: 'view',
    section: 'view',
    aside: 'view',
    nav: 'view',
    header: 'view',
    footer: 'view',
    pre: 'view',
    code: 'view',

    // Object
    // eg
    //     <a class="home-link" href='xxx'></a>
    // 转为:
    //     <navigator class="okam-inline home-link" url='xxx'></navigator>
    a: {
        tag: 'navigator',
        class: 'okam-inline',
        href: 'url'
    },

    // string
    img: 'image'
};

exports.miniProgramToH5 = {
    view: 'div',
    text: 'span',
    navigator: {
        tag: 'a',
        url: 'href'
    },
    image: 'img'
};
