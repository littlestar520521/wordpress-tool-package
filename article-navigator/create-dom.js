const nav = {
    /**
     * 块级标题单位
     */
    ut: '章',
    /**
     * 列表项内容单位，可没有
     */
    un: '章',
    data: [
        {
            /**
             * 块级标题
             */
            title: {
                n: '1-2',
                c: '潜入饭店（新田浩介篇）'
            },
            /**
             * 列表项
             */
            list: ['1', '2']
        },
    ]
};

/**
 * content unit
 */
const unit = ['chapter', 'section', 'lesson', 'part'];
/**
 * get en version of unit given by zh
 */
var u_en = function getUnit(u_zh) {
    switch (u_zh) {
        case '章': return unit[0];
        case '节': return unit[1];
        case '讲': return unit[2];
        case '课': return unit[2];
        case '部分': return unit[3];
        default: return '';
    }
}(nav.un);
/**
 * create block div
 * @param {string} p1 
 * @param {string} p2 block title
 * @param {string} p3 nav li string
 */
function createChildDiv(p1, p2, p3) {
    var ch = document.createElement('div');
    ch.setAttribute('class', 'an-block');
    ch.innerHTML = `<div><div class="an-block-title"><div class="block-title-pre"><div class="block-title-pre-in"><span><i class="fa fa-leaf" aria-hidden="true"></i></span><div><span>第</span><span>${p1}</span><span>${nav.ut}</span></div><span><i class="fa fa-angle-down" aria-hidden="true"></i></span></div></div><div class="title-content">${p2}</div></div><ul class="an-nav">${p3}</ul></div>`;
    blockArea.appendChild(ch);
}
/**
 * create nav inner li string
 * @param {Array<{t:string, m:string}>|Array<string>} list nav list data
 */
function createLiString(list) {
    var str = '';
    if (u_en && typeof list[0] == 'string') {
        list.forEach(function (item) {
            str = str.concat(`<li><a href="#${u_en.concat(item)}">第${item.concat(nav.un)}</a></li>`);
        })
    }
    else if (!u_en && typeof list[0] == 'object') {
        list.forEach(function (item) {
            str = str.concat(`<li><a href="#${item.m}">${item.t}</a></li>`);
        })
    }
    return str;
}

nav.data.forEach(function (item) {
    createChildDiv(item.title.n, item.title.c, createLiString(item.list));
})

var div_hack = document.createElement('div');
div_hack.style.height = '5px';
blockArea.appendChild(div_hack);