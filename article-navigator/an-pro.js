(function (n) {
    var anRoot = document.getElementById("customize-article-navigator"),
        blockArea = document.querySelector(".an-block-container"),
        blockAreaCon = blockArea.parentElement,
        scrollBar = document.querySelector(".an-scroller-progress"),
        scrollBarCon = scrollBar.parentElement,
        cssPros = [
            "--an-scroll-bar-len",
            "--an-scroll-bar-move",
            "--an-blocks-area-move",
        ],
        vClass = [
            "an-hide-all",
            "an-close-side",
            "an-show-all",
            "an-scroller-show",
            "an-no-equal-height"
        ],
        an = {
            coreSizeValue() {
                var list = {
                    blocks: [0, 0],
                    bar: [0, 0],
                    win: [0, 0],
                    an: [262, 119],
                },
                    anSize = {
                        get width() {
                            return list.an[0];
                        },
                        get minHeight() {
                            return list.an[1];
                        },
                    },
                    blocksHeight = {
                        get con() {
                            return list.blocks[0];
                        },
                        get self() {
                            return list.blocks[1];
                        },
                    },
                    barLength = {
                        get con() {
                            return list.bar[0];
                        },
                        get self() {
                            return list.bar[1];
                        },
                    },
                    winSize = {
                        get width() {
                            return list.win[0];
                        },
                        get height() {
                            return list.win[1];
                        },
                    },
                    refresh = function () {
                        list.blocks[0] = blockAreaCon.getBoundingClientRect().height;
                        list.blocks[1] = blockArea.getBoundingClientRect().height;
                        list.bar[0] = scrollBarCon.getBoundingClientRect().height;
                        list.bar[1] = list.blocks[1] ? (list.bar[0] * list.blocks[0]) / list.blocks[1] : 0;
                        list.win[0] = window.innerWidth;
                        list.win[1] = window.innerHeight;
                    };
                return {
                    an: anSize,
                    blocks: blocksHeight,
                    bar: barLength,
                    win: winSize,
                    update: refresh,
                };
            },
            navListRender(nav) {
                var unit = ['chapter', 'section', 'lesson', 'part'],
                    u_en = function getUnit(u_zh) {
                        switch (u_zh) {
                            case '章': return unit[0];
                            case '节': return unit[1];
                            case '讲': return unit[2];
                            case '课': return unit[2];
                            case '部分': return unit[3];
                            default: return '';
                        }
                    }(nav.un);
                function createChildDiv(p1, p2, p3) {
                    var ch = document.createElement('div');
                    ch.setAttribute('class', 'an-block');
                    ch.innerHTML = `<div><div class="an-block-title"><div class="block-title-pre"><div class="block-title-pre-in"><span><i class="fa fa-leaf" aria-hidden="true"></i></span><div><span>第</span><span>${p1}</span><span>${nav.ut}</span></div><span><i class="fa fa-angle-down" aria-hidden="true"></i></span></div></div><div class="title-content">${p2}</div></div><ul class="an-nav">${p3}</ul></div>`;
                    blockArea.appendChild(ch);
                }
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
            },
            scrollBar() {
                var sizeObj = coreSizeValue();
                sizeObj.update();
                var temps = {
                    y: 0,
                    d: sizeObj.bar.con - sizeObj.bar.self,
                    wob: 0,
                    rt: 0,
                    rc: false
                };
                function getBlocksMoveLength(move) {
                    return (
                        (move * (sizeObj.blocks.self - sizeObj.blocks.con)) /
                        (sizeObj.bar.con - sizeObj.bar.self)
                    );
                }
                function setScrollBarLen(len) {
                    anRoot.style.setProperty(cssPros[0], len + "px");
                }
                function setScrollBarPos(move) {
                    anRoot.style.setProperty(cssPros[1], move + "px");
                }
                function setBlocksAreaPos(move) {
                    anRoot.style.setProperty(cssPros[2], getBlocksMoveLength(move) + "px");
                }
                function isScrollBarNeeded() {
                    return sizeObj.blocks.con < sizeObj.blocks.self ? true : false;
                }
                function showNavigator() {
                    var t = anRoot.classList;
                    t.remove(vClass[0]);
                    setTimeout(function () {
                        t.remove(vClass[1]);
                        setTimeout(function () {
                            t.add(vClass[2]);
                        }, 500);
                    }, 500);
                }
                function closeNavigator() {
                    var t = anRoot.classList;
                    t.remove(vClass[2]);
                    t.add(vClass[1]);
                    setTimeout(function () {
                        t.add(vClass[0]);
                    }, 500);
                }
                function isNavVisible() {
                    if (anRoot.classList.contains(vClass[2])) {
                        return true;
                    }
                    if (anRoot.classList.contains(vClass[0]) && anRoot.classList.contains(vClass[1])) {
                        return false;
                    }
                }
                function reLayout() {
                    sizeObj.update();
                    if (sizeObj.win.width < sizeObj.an.width + 20 || sizeObj.win.height < sizeObj.an.minHeight + 25) {
                        console.error('window size is too small, the article navigator cannot be shown completely');
                        isNavVisible() ? closeNavigator() : {};
                        return;
                    }
                    if (!sizeObj.bar.self) return;
                    if (isScrollBarNeeded()) {
                        var rate = temps.y / temps.d;
                        temps.d = sizeObj.bar.con - sizeObj.bar.self;
                        temps.y = rate * temps.d;
                        setScrollBarLen(sizeObj.bar.self);
                        setScrollBarPos(temps.y);
                        setBlocksAreaPos(temps.y);
                        scrollBarCon.classList.add(vClass[4]);
                    } else {
                        scrollBarCon.classList.remove(vClass[4]);
                    }
                }
                function wheelHandler(e) {
                    if (temps.y + e.deltaY <= temps.d && temps.y >= -e.deltaY) {
                        temps.y += e.deltaY;
                    } else if (temps.y < temps.d && temps.y > -e.deltaY) {
                        temps.y = temps.d;
                    } else if (temps.y < -e.deltaY && temps.y > 0) {
                        temps.y = 0;
                    } else {
                        return;
                    }
                    setScrollBarPos(temps.y);
                    setBlocksAreaPos(temps.y);
                }
                function resizeHandler() {
                    if (!isNavVisible()) {
                        temps.rc = true;
                        return;
                    }
                    reLayout();
                }
                blockArea.addEventListener("wheel", function (e) {
                    scrollBarCon.classList.add(vClass[3]);
                    if (temps.wob) {
                        clearTimeout(temps.wob);
                    }
                    temps.wob = setTimeout(function () {
                        scrollBarCon.classList.remove(vClass[3]);
                        temps.wob = 0;
                    }, 2000);
                    wheelHandler(e);
                });
                scrollBarCon.addEventListener("wheel", function (e) {
                    wheelHandler(e);
                });
                document.querySelector(".bottom-cube-front>div").addEventListener("click", function () {
                    if (isNavVisible()) {
                        closeNavigator();
                    }
                    else if (!isNavVisible()) {
                        showNavigator();
                        if (temps.rc) {
                            reLayout();
                            temps.rc = false;
                        }
                    }
                });
                window.addEventListener("resize", function () {
                    if (temps.rt) {
                        clearTimeout(temps.rt);
                    }
                    temps.rt = setTimeout(function () {
                        resizeHandler();
                        temps.rt = 0;
                    }, 1000);
                });
                if (isScrollBarNeeded()) {
                    setScrollBarLen(sizeObj.bar.self);
                    scrollBarCon.classList.add(vClass[4]);
                }
            }
        };
    an.navListRender(n);
    an.scrollBar();
}(navData))