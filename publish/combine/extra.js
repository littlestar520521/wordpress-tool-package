/*
 * 此版本（v2.0）变化：
 * 1. HTML和CSS内容将不再用JavaScript添加，HTML部分集成到页面中，CSS部分采用外联样式表
 * 2. 取消Live2D减轻浏览器负担
 * 3. 新增自定义章节导航功能
 */
(function (op) {
	var tip = {
			o: [
				"播放背景音乐",
				"暂停背景音乐",
				"更换壁纸为Bing美图",
				"换回原来壁纸",
				"使用夜猫子外观",
				"使用日间外观",
			],
			e: ["图像加载失败", "获取图像地址失败"],
		},
		cls = {
			v: {
				toolBarHide: "tb-all-hide",
				menuHide: "tb-menu-hide",
				iconClick: "tb-icon-clicking",
				maskHide: "tb-window-mask-hide",
				tipHide: "tb-tip-hide",
			},
			r: {
				picMove: "tb-pic-move",
				bgMove: "tb-pic-bg-move",
			},
			i: {
				dayIcon: "fa fa-tree",
				dayBg: "fa fa-sun-o",
				nightBgAndIcon: "fa fa-star",
				bgmPlay: "fa fa-play",
				bgmPause: "fa fa-pause",
				closeTb: "fa fa-angle-up",
				showTb: "fa fa-angle-down",
			},
			w: {
				start: "customize-wallpaper-bg-start",
				end: "customize-wallpaper-bg-end",
			},
			t: {
				day: "body-bg-day",
				night: "body-bg-night",
			},
		},
		sls = {
			b: {
				bingImageButton: '[data-func="bing-wallpaper"]>div:first-child',
				bgmControlButton:
					'[data-func="bgm-controller"]>div:first-child',
				backToTopButton: '[data-func="back-to-top"]>div:first-child',
				closeMenuButton: '[data-func="hide-menu"]>div:first-child',
				shiftThemeButton: '[data-func="shift-theme"]>div:first-child',
			},
			p: ".tb-core",
			a: ".tb-blank-bg",
			m: ".tb-icon-set",
			e: ".tb-blank-tip>div",
            c: ".tb-bottom-close",
            t: "customize-toolbar"
		},
		t = {
			getDom(s, id = false) {
				return id
					? document.getElementById(s)
					: document.querySelector(s);
			},
			toggleCssClass(d, c, r) {
				r ? d.classList.remove(c) : d.classList.add(c);
			},
			popErrorLog(t1, t2) {
				var l = this.getDom(sls.e);
				l.innerHTML = t1;
				l.classList.remove(cls.v.tipHide);
				this.switchPicAnimation(true);
				console.error(t2);
				setTimeout(function () {
					l.classList.add(cls.v.tipHide);
				}, 3000);
			},
			switchPicAnimation(r) {
				this.toggleCssClass(this.getDom(sls.p), cls.r.picMove, r);
			},
			setSiteTheme(t, b) {
				if (t) {
					Object.keys(op.siteTheme.dayTheme.css).forEach(function (
						cssKey
					) {
						b.style.setProperty(
							cssKey,
							op.siteTheme.dayTheme.css[cssKey]
						);
					});
					b.classList.remove(cls.t.night);
					b.classList.add(cls.t.day);
				} else {
					Object.keys(op.siteTheme.nightTheme.css).forEach(function (
						cssKey
					) {
						b.style.setProperty(
							cssKey,
							op.siteTheme.nightTheme.css[cssKey]
						);
					});
					b.classList.remove(cls.t.day);
					b.classList.add(cls.t.night);
				}
			},
			setToolbarTheme(t, si, s, tb) {
				if (t) {
					si.setAttribute("class", cls.i.nightBgAndIcon);
					s.nextElementSibling.innerHTML = tip.o[4];
					tb.style.setProperty(
						"--tb-bg-blank-color",
						op.toolbarTheme["bg-pattern-color"][0]
					);
				} else {
					si.setAttribute("class", cls.i.dayIcon);
					s.nextElementSibling.innerHTML = tip.o[5];
					tb.style.setProperty(
						"--tb-bg-blank-color",
						op.toolbarTheme["bg-pattern-color"][1]
					);
				}
			},
			setBingWallpaper(u) {
				var temp = document.createElement("img"),
					_this = this;
				temp.setAttribute("src", u);
				temp.addEventListener("load", function () {
					var b = document.body;
					if (!b.style.transition) {
						b.style.transition = "background-position-x 2s linear";
					}
					b.classList.add(cls.w.start);
					setTimeout(function () {
						b.classList.add(cls.w.end);
						b.style.backgroundImage = `url(${u})`;
						_this.getDom(
							sls.b.bingImageButton
						).nextElementSibling.innerHTML = tip.o[3];
						_this.switchPicAnimation(true);
					}, 2000);
				});
				temp.addEventListener("error", function () {
					_this.popErrorLog(tip.e[0], "load image failed");
				});
			},
			getBingWallpaperFromCache() {
				var localCache = localStorage.getItem("today-bing-image");
				if (localCache) {
					var localObj = JSON.parse(localCache);
					if (
						new Date(localObj.time).getDate() !==
						new Date().getDate()
					) {
						this.getBingWallpaperFromServer();
					} else {
						this.switchPicAnimation(false);
						this.setBingWallpaper(localObj.url, true);
					}
				} else {
					this.getBingWallpaperFromServer();
				}
			},
			getBingWallpaperFromServer() {
				this.switchPicAnimation(false);
				var cusHeader = new Headers();
				cusHeader.append("x-token", op.bingImageApi.token);
				var cusInit = { headers: cusHeader },
					_this = this;
				fetch(op.bingImageApi.url, cusInit)
					.then(function (d) {
						if (d.status !== 200) {
							throw new Error("get image url failed");
						}
						return d.text();
					})
					.then(function (r) {
						_this.setBingWallpaper(r, true);
						return r;
					})
					.then(function (d) {
						var s = {
							url: d,
							time: new Date().getTime(),
						};
						localStorage.setItem(
							"today-bing-image",
							JSON.stringify(s)
						);
					})
					.catch(function (e) {
						_this.popErrorLog(tip.e[1], e);
					});
			},
			backToOriginBackground() {
				var b = document.body,
					_this = this;
				b.classList.remove(cls.w.end);
				setTimeout(function () {
					b.style.removeProperty("background-image");
					b.classList.remove(cls.w.start);
					_this.getDom(
						sls.b.bingImageButton
					).nextElementSibling.innerHTML = tip.o[2];
				}, 2000);
			},
        };
	var au = t.getDom(sls.b.bgmControlButton),
		tb = t.getDom(sls.t, true),
		m = t.getDom(sls.m),
		s = t.getDom(sls.b.shiftThemeButton),
		si = s.getElementsByTagName("i")[0],
		a = document.createElement("audio"),
		hour = new Date().getHours(),
		pt = localStorage.getItem("preferred-theme"),
		domExist = t.getDom("day-night-theme-image", true);
	Object.keys(sls.b).forEach(function (btn) {
		var b = t.getDom(sls.b[btn]);
		b.addEventListener("mousedown", function () {
			b.classList.toggle(cls.v.iconClick);
		});
		b.addEventListener("mouseup", function () {
			b.classList.toggle(cls.v.iconClick);
		});
	});
	t.getDom(sls.b.backToTopButton).addEventListener("click", function () {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
	t.getDom(sls.b.closeMenuButton).addEventListener("click", function () {
		m.classList.add(cls.v.menuHide);
	});
	t.getDom(sls.b.bingImageButton).addEventListener("click", function () {
		document.body.style.backgroundImage
			? t.backToOriginBackground()
			: t.getBingWallpaperFromCache();
	});
	t.getDom(sls.a).addEventListener("click", function (e) {
		e.stopPropagation();
		m.classList.toggle(cls.v.menuHide);
	});
	t.getDom(sls.c).addEventListener("click", function () {
		var _this = this;
		if (tb.classList.contains(cls.v.toolBarHide)) {
			tb.classList.remove(cls.v.toolBarHide);
			_this
				.getElementsByTagName("i")[0]
				.setAttribute("class", cls.i.closeTb);
		} else {
			if (m.classList.contains(cls.v.menuHide)) {
				tb.classList.add(cls.v.toolBarHide);
			} else {
				m.classList.add(cls.v.menuHide);
				setTimeout(function () {
					tb.classList.add(cls.v.toolBarHide);
				}, 500);
			}
			_this
				.getElementsByTagName("i")[0]
				.setAttribute("class", cls.i.showTb);
		}
	});
	window.addEventListener("load", function () {
		tb.classList.remove(cls.v.toolBarHide);
		setTimeout(function () {
			m.classList.remove(cls.v.menuHide);
			var l = t.getDom(sls.e);
			l.classList.remove(cls.v.tipHide);
			setTimeout(function () {
				l.classList.add(cls.v.tipHide);
			}, 5000);
		}, 1000);
	});
	s.addEventListener("click", function () {
		var b = document.body;
		if (b.classList.contains(cls.t.day)) {
			t.setSiteTheme(0, b);
			t.setToolbarTheme(0, si, s, tb);
			localStorage.setItem("preferred-theme", "n");
		} else {
			t.setSiteTheme(1, b);
			t.setToolbarTheme(1, si, s, tb);
			localStorage.setItem("preferred-theme", "d");
		}
	});
	au.addEventListener("click", function () {
		var d = document.querySelector("audio");
		if (!d.src) {
			d.src = d.getAttribute("data-url");
		}
		if (d.paused || d.played.length === 0) {
			d.play();
			au.getElementsByTagName("i")[0].setAttribute(
				"class",
				cls.i.bgmPause
			);
			au.nextElementSibling.innerHTML = tip.o[1];
		} else {
			d.pause();
			au.getElementsByTagName("i")[0].setAttribute(
				"class",
				cls.i.bgmPlay
			);
			au.nextElementSibling.innerHTML = tip.o[0];
		}
	});
	a.setAttribute("data-length", op.bgm.length);
	a.setAttribute("data-url", op.bgm.url);
	a.loop = true;
    document.body.appendChild(a);
	Object.keys(op.toolbarTheme).forEach(function (cssKey) {
		if (cssKey !== "bg-pattern-color") {
			tb.style.setProperty("--tb-" + cssKey, op.toolbarTheme[cssKey]);
		}
	});
	if (hour >= 6 && hour <= 18) {
		if (pt == "n") {
			t.setSiteTheme(0, document.body);
			t.setToolbarTheme(0, si, s, tb);
		} else {
			t.setSiteTheme(1, document.body);
			t.setToolbarTheme(1, si, s, tb);
		}
		domExist ? domExist.setAttribute("src", op.siteTheme.dayTheme.image) : {};
		t.getDom(sls.a)
			.getElementsByTagName("i")[0]
			.setAttribute("class", cls.i.dayBg);
	}
	else {
		if (pt == "d") {
			t.setSiteTheme(1, document.body);
			t.setToolbarTheme(1, si, s, tb);
		} else {
			t.setSiteTheme(0, document.body);
			t.setToolbarTheme(0, si, s, tb);
		}
		domExist ? domExist.setAttribute("src", op.siteTheme.nightTheme.image) : {};
		t.getDom(sls.a)
			.getElementsByTagName("i")[0]
			.setAttribute("class", cls.i.nightBgAndIcon);
	}
})(customizeThemeOpt);
(function (n) {
	if (n == "") {
		document.getElementById("customize-article-navigator").classList.add('customize-mobile-hidden');
		return;
	}
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
                function createLiStringWithArray(list, unit) {
                    var str = '';
                    if (u_en) {
                        list.forEach(function (item) {
                            str = str.concat(`<li><a href="#${u_en.concat(item)}">第${item.toString().concat(unit)}</a></li>`);
                        })
                    }
                    return str;
                }
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
                function createLiStringWithObj(list, unit) {
                    var ks = Object.keys(list),
                        str = '';
                    if (u_en && ks.includes('s') && ks.includes('e')) {
                        if (typeof list.s == 'number' && typeof list.e == 'number') {
                            for (var i = list.s; i <= list.e; i++) {
                                str = str.concat(`<li><a href="#${u_en.concat(i)}">第${i.toString().concat(unit)}</a></li>`);
                            }
                        }
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
                    else if (typeof list == 'object') {
                        return list == null ? '' : createLiStringWithObj(list, unit);
                    }
                    return '';
                }
                nav.data.forEach(function (item) {
                    createChildDiv(item.title.n, item.title.c, createLiString(item.list, nav.un));
                })
                var div_hack = document.createElement('div');
                div_hack.style.height = '5px';
                blockArea.appendChild(div_hack);
            },
            scrollBar() {
                var sizeObj = this.coreSizeValue();
                sizeObj.update();
                var temps = {
                    m: 0,
                    y: 0,
                    d: sizeObj.bar.con - sizeObj.bar.self,
                    wob: 0,
                    rt: 0,
                    rc: false,
                    f: false,
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
                function moveHandler(e) {
                    if (e.clientY > temps.m) {
                        temps.y + (e.clientY - temps.m) <= temps.d ? temps.y += (e.clientY - temps.m) : temps.y = temps.d;
                    }
                    else {
                        temps.y - (temps.m - e.clientY) >= 0 ? temps.y -= (temps.m - e.clientY) : temps.y = 0;
                    }
                    temps.m = e.clientY;
                    setScrollBarPos(temps.y);
                    setBlocksAreaPos(temps.y);
                }
                blockArea.addEventListener("wheel", function (e) {
                    e.cancelable ? e.preventDefault() : {};
                    e.stopPropagation();
                    scrollBarCon.classList.add(vClass[3]);
                    if (temps.wob) {
                        clearTimeout(temps.wob);
                    }
                    temps.wob = setTimeout(function () {
                        scrollBarCon.classList.remove(vClass[3]);
                        temps.wob = 0;
                    }, 2000);
                    wheelHandler(e);
                }, { passive: false });
                scrollBarCon.addEventListener("wheel", function (e) {
                    e.cancelable ? e.preventDefault() : {};
                    e.stopPropagation();
                    wheelHandler(e);
                }, { passive: false });
                scrollBar.addEventListener("mousedown", function (e) {
                    temps.m = e.clientY;
                    temps.f = true;
                });
                scrollBar.addEventListener("mousemove", function (e) {
                    if (temps.f) moveHandler(e);
                });
                scrollBar.addEventListener("mouseup", function () {
                    temps.f = false;
                });
                document.querySelector(".bottom-cube-front>div").addEventListener("click", function () {
                    if (isNavVisible()) {
                        closeNavigator();
                    }
                    else {
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
}(
	function () {
		return typeof navData == "undefined" ? "" : navData;
	}()
))
//TODO: 页面类型的post中不需要显示、添加导航项目繁琐
//FIXME: nav列表为空时div盒子显示异常、滚动滚动条时窗口也跟着滚动、对不存在的DOM执行方法引发异常