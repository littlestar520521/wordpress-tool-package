const navData = {
    ut: '章',
    un: '章',
    data: [
        {
            title: {
                n: '3-5',
                c: '潜入饭店（山岸尚美篇）'
            },
            list: {s:3,e:5}
        },
        {
            title: {
                n: '1-2',
                c: '潜入饭店（新田浩介篇）'
            },
            list: ['1', '2']
        },
        {
            title: {
                n: '1-2',
                c: '潜入饭店（新田浩介篇）'
            },
            list: ['1-1', '1-2']
        },
        {
            title: {
                n: '3-5',
                c: '潜入饭店（山岸尚美篇）'
            },
            list: [3,4,5]
        },
        {
            title: {
                n: '3-5',
                c: '潜入饭店（山岸尚美篇）'
            },
            list: {s:'3-1',e:'3-7'}
        },
    ]
}
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
}(navData.un);
/**
 * create block div
 * @param {string} p1 
 * @param {string} p2 block title
 * @param {string} p3 nav li string
 */
function createChildDiv(p1, p2, p3) {
    var ch = document.createElement('div');
    ch.setAttribute('class', 'an-block');
    ch.innerHTML = `<div><div class="an-block-title"><div class="block-title-pre"><div class="block-title-pre-in"><span><i class="fa fa-leaf" aria-hidden="true"></i></span><div><span>第</span><span>${p1}</span><span>${navData.ut}</span></div><span><i class="fa fa-angle-down" aria-hidden="true"></i></span></div></div><div class="title-content">${p2}</div></div><ul class="an-nav">${p3}</ul></div>`;
    blockArea.appendChild(ch);
}
/**
 * create nav inner li string
 * @param {Array<string>|Array<number>} list nav list data
 * @param {string} unit
 */
function createLiStringWithArray(list, unit) {
    var str = '';
    if (u_en) {
        list.forEach(function (item) {
            str = str.concat(`<li><a href="#${u_en.concat(item)}">第${item.toString().concat(unit)}</a></li>`);
        })
    }
    return str;
}
/**
 * create nav inner li string
 * @param {Array<{t:string, m:string}>} list nav list data
 */
function createLiStringWithObjArray(list) {
    var str = '',
        ks = Object.keys(list[0]);
    if (ks.includes('m') && ks.includes('t')) {
        list.forEach(function (item) {
            str = str.concat(`<li><a href="#${item.m}">${item.t}</a></li>`);
        })
    }
    return str;
}
/**
 * create nav inner li string with given start-end number and item unit
 * @param {{s:number, e:number}|{s:string, e:string}} list 
 * @param {string} unit
 */
function createLiStringWithObj(list, unit) {
    var ks = Object.keys(list),
        str = '';
    if (u_en && ks.includes('s') && ks.includes('e')) {
        //e.g. start:1, end:11
        if (typeof list.s == 'number' && typeof list.e == 'number') {
            for (var i = list.s; i <= list.e; i++) {
                str = str.concat(`<li><a href="#${u_en.concat(i)}">第${i.toString().concat(unit)}</a></li>`);
            }
        }
        //e.g. start:3-5, end:3-9
        else if (typeof list.s == 'string' && typeof list.e == 'string') {
            var start = list.s.split('-'),
                end = list.e.split('-');
            if (start.length > 0 && end.length > 0) {
                var pre = start[0].concat('-');
                for (var i = start[1]; i <= end[1]; i++) {
                    str = str.concat(`<li><a href="#${u_en.concat(pre.concat(i))}">第${pre.concat(i).concat(unit)}</a></li>`);
                }
            }
        }
    }
    return str;
}
function createLiString(list, unit) {
    if (list instanceof Array) {
        if (typeof list[0] == 'number' || typeof list[0] == 'string') {
            return createLiStringWithArray(list, unit);
        }
        else if (typeof list[0] == 'object') {
            return createLiStringWithObjArray(list);
        }
    }
    else if (typeof list == 'object' && !(list instanceof Array)) {
        return createLiStringWithObj(list, unit);
    }
    else {
        return '';
    }
}

navData.data.forEach(function (item) {
    createChildDiv(item.title.n, item.title.c, createLiString(item.list, navData.un));
})

var div_hack = document.createElement('div');
div_hack.style.height = '5px';
blockArea.appendChild(div_hack);