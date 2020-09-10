const toolbar_opt = {
	toolbarTheme: {
		"font-color": "coral",
		"bg-color": "beige",
		"border-shadow-color": "lightcoral",
		"bg-hover-color": "lightpink",
		"bg-img-css":
			"url(https://cdn.jsdelivr.net/gh/littlestar520521/wordpress-backup@1.2.1/assets/bad27a027fff5ca54756c7da2e6cc756_optimized.png)",
	},
	bgm: {
		url: "",
		length: 0,
	},
	mobileVisibility: 0,
};

class ToolBar {
	t = {
		o: [
			"播放背景音乐",
			"暂停背景音乐",
			"更换壁纸为Bing美图",
			"换回原来壁纸",
		],
		e: ["图像加载失败", "获取图像地址失败", "无效音乐文件地址"],
	};
	c = {
		v: {
			toolBarHide: "customize-toolbar-hide-all",
			menuHide: "customize-toolbar-hide",
			iconClick: "customize-toolbar-icon-clicking",
		},
		r: {
			picMove: "customize-toolbar-pic-move",
			bgMove: "customize-toolbar-pic-bg-move",
		},
		i: {
			dayBg: "fa fa-sun-o",
			nightBg: "fa fa-star",
			bgmPlay: "fa fa-play",
			bgmPause: "fa fa-pause",
		},
	};
	d = {
		t: "#wp-toolbar-customize",
		b: {
			bingImageButton: '[data-func="bing-wallpaper"]>div:first-child',
			bgmControlButton: '[data-func="bgm-controller"]>div:first-child',
			backToTopButton: '[data-func="back-to-top"]>div:first-child',
			closeMenuButton: '[data-func="hide-menu"]>div:first-child',
		},
		p: ".customize-toolbar-core",
		a: ".customize-toolbar-blank",
		m: ".customize-toolbar-icon-set",
		e: ".customize-toolbar-blank-tip>div",
	};
	api = {
		token: "https://www.littlemeteor.me/api/customization",
		bingwallpaper: "https://www.littlemeteor.me/api/bingwallpaper",
	};
	constructor(param) {
		this.theme = param.toolbarTheme;
		this.bgm = param.bgm;
		this.mv = param.mobileVisibility;
	}
	/**
	 * Get Dom
	 * @param {string} s
	 */
	getDom(s) {
		return document.querySelector(s);
	}
	/**
	 * toggle css class
	 * @param {Element} d dom
	 * @param {string} c class name
	 * @param {boolean} r confirm remove class?
	 */
	toggleCssClass(d, c, r) {
		r ? d.classList.remove(c) : d.classList.add(c);
	}
	/**
	 * pop error tip
	 * @param {string} t1 show alert
	 * @param {string} t2 console log
	 */
	popErrorLog(t1, t2) {
		var l = this.getDom(".customize-toolbar-blank-tip>div");
		l.innerHTML = t1;
		l.classList.remove("customize-toolbar-hide-tip");
		this.switchPicAnimation(true);
		console.error(t2);
		setTimeout(function () {
			l.classList.add("customize-toolbar-hide-tip");
		}, 3000);
	}
	/**
	 * switch toolbar img animation
	 * @param {boolean} r confirm stop?
	 */
	switchPicAnimation(r) {
		this.toggleCssClass(this.getDom(this.d.p), this.c.r.picMove, r);
	}
	/**
	 * set bingwallpaper
	 * @param {string} u
	 */
	setBingWallpaper(u) {
		var temp = document.createElement("img"),
			_this = this;
		temp.setAttribute("src", u);
		temp.addEventListener("load", function () {
			var b = document.body;
			if (!b.style.transition) {
				b.style.transition = "background-position-x 2s linear";
			}
			b.classList.add("bingwallpaper-bg-start");
			setTimeout(function () {
				b.classList.add("bingwallpaper-bg-end");
				b.style.backgroundImage = `url(${u})`;
				_this.getDom(
					_this.d.b.bingImageButton
				).nextElementSibling.innerHTML = _this.t.o[3];
				_this.switchPicAnimation(true);
			}, 2000);
		});
		temp.addEventListener("error", function () {
			_this.popErrorLog(_this.t.e[0], "load image failed");
		});
	}
	getBingWallpaperFromCache() {
		var localCache = localStorage.getItem("today-bing-image");
		if (localCache) {
			var localObj = JSON.parse(localCache);
			if (new Date(localObj.time).getDate() !== new Date().getDate()) {
				this.getBingWallpaperFromServer();
			} else {
				this.switchPicAnimation(false);
				this.setBingWallpaper(localObj.url);
			}
		} else {
			this.getBingWallpaperFromServer();
		}
	}
	getBingWallpaperFromServer() {
		var _this = this;
		_this.switchPicAnimation(false);
		fetch(_this.api.token)
			.then(function (d) {
				if (d.status !== 200) {
					throw new Error("get image url failed");
				}
				return d.text();
			})
			.then(function (d) {
				fetch(_this.api.bingwallpaper, {
					body: d,
					method: "POST",
					mode: "cors",
				})
					.then(function (d) {
						if (d.status !== 200) {
							throw new Error("get image url failed");
						}
						return d.text();
					})
					.then(function (r) {
						_this.setBingWallpaper(r);
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
					});
			})
			.catch(function (e) {
				_this.popErrorLog(_this.t.e[1], e);
			});
	}
	backToOriginBackground() {
		var b = document.body,
			_this = this;
		b.classList.remove("bingwallpaper-bg-end");
		setTimeout(function () {
			b.style.removeProperty("background-image");
			b.classList.remove("bingwallpaper-bg-start");
			_this.getDom(
				_this.d.b.bingImageButton
			).nextElementSibling.innerHTML = _this.t.o[2];
		}, 2000);
	}
	render() {
		var t = this,
			au = t.getDom(t.d.b.bgmControlButton),
			i = au.getElementsByTagName("i")[0],
			a = document.createElement("audio"),
			tb = t.getDom(t.d.t);
		Object.keys(t.d.b).forEach(function (btn) {
			var b = t.getDom(t.d.b[btn]);
			b.addEventListener("mousedown", function () {
				b.classList.toggle(t.c.v.iconClick);
			});
			b.addEventListener("mouseup", function () {
				b.classList.toggle(t.c.v.iconClick);
			});
		});
		t.getDom(t.d.b.backToTopButton).addEventListener("click", function () {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
		t.getDom(t.d.b.closeMenuButton).addEventListener("click", function () {
			t.getDom(t.d.m).classList.add(t.c.v.menuHide);
		});
		t.getDom(t.d.a).addEventListener("click", function (e) {
			e.stopPropagation();
			t.getDom(t.d.m).classList.toggle(t.c.v.menuHide);
		});
		t.getDom(t.d.b.bingImageButton).addEventListener("click", function () {
			document.body.style.backgroundImage
				? t.backToOriginBackground()
				: t.getBingWallpaperFromCache();
		});
		window.addEventListener("load", function () {
			t.getDom(t.d.m).classList.toggle(t.c.v.menuHide);
			var l = t.getDom(".customize-toolbar-blank-tip>div");
			l.classList.remove("customize-toolbar-hide-tip");
			setTimeout(function () {
				l.classList.add("customize-toolbar-hide-tip");
			}, 10000);
		});
		au.addEventListener("click", function () {
			var d = document.querySelector("audio"),
				v = true;
			if (!d.src) {
				var s = d.getAttribute("data-url");
				if (!s) {
					v = false;
					t.popErrorLog(t.t.e[2], t.t.e[2]);
				} else {
					d.src = s;
				}
			}
			if (v) {
				if (d.paused || d.played.length === 0) {
					d.play();
					i.setAttribute("class", t.c.i.bgmPause);
					au.nextElementSibling.innerHTML = t.t.o[1];
				} else {
					d.pause();
					i.setAttribute("class", t.c.i.bgmPlay);
					au.nextElementSibling.innerHTML = t.t.o[0];
				}
			}
		});
		a.setAttribute("data-length", t.bgm.length);
		a.setAttribute("data-url", t.bgm.url);
		a.loop = true;
		document.body.appendChild(a);
		Object.keys(t.theme).forEach(function (cssKey) {
			tb.style.setProperty("--main-" + cssKey, t.theme[cssKey]);
		});
		var hour = new Date().getHours();
		hour >= 6 && hour <= 18
			? t
					.getDom(t.d.a)
					.getElementsByTagName("i")[0]
					.setAttribute("class", t.c.i.dayBg)
			: t
					.getDom(t.d.a)
					.getElementsByTagName("i")[0]
					.setAttribute("class", t.c.i.nightBg);
	}
	load() {
		var toolbar_html =
				'<div class="customize-toolbar-pic"><div class="customize-toolbar-topline"></div><div class="customize-toolbar-topdot"></div><div class="customize-toolbar-core"></div></div><div class="customize-toolbar-menu"><div class="customize-toolbar-icon-set"><div class="customize-toolbar-icon" data-func="bing-wallpaper"><div class="customize-toolbar-icon-func" aria-label="change background image to today’s bing image"><i class="fa fa-paint-brush" aria-hidden="false"></i></div><div class="customize-toolbar-icon-tip">更换壁纸为Bing美图</div></div><div class="customize-toolbar-icon" data-func="bgm-controller"><div class="customize-toolbar-icon-func" aria-label="play or pause the BGM"><i class="fa fa-play" aria-hidden="false"></i></div><div class="customize-toolbar-icon-tip">播放背景音乐</div></div><div class="customize-toolbar-icon" data-func="back-to-top"><div class="customize-toolbar-icon-func" aria-label="go back to the top"><i class="fa fa-arrow-up" aria-hidden="false"></i></div><div class="customize-toolbar-icon-tip">返回顶部</div></div><div class="customize-toolbar-icon" data-func="hide-menu"><div class="customize-toolbar-icon-func" aria-label="close the menu"><i class="fa fa-angle-right" aria-hidden="false"></i></div><div class="customize-toolbar-icon-tip">隐藏菜单</div></div></div><div class="customize-toolbar-blank"><div class="customize-toolbar-blank-bg"><i class="" aria-hidden="true"></i></div><div class="customize-toolbar-blank-tip"><div class="customize-toolbar-hide-tip"><div>单击收起/展开菜单</div></div></div></div></div>',
			toolbar_css =
				"body.bingwallpaper-bg-start{background-position-x:100vw;}body.bingwallpaper-bg-end{background-position-x:center;background-attachment:fixed;background-repeat:no-repeat;background-size:cover;}body.bingwallpaper-bg-end::before,body.bingwallpaper-bg-end::after{background:unset;}#wp-toolbar-customize{transition:all .5s linear;position:fixed;width:200px;height:200px;bottom:2px;right:-2px;opacity:1;--tb-bottom:162px}.customize-toolbar-icon-func.customize-toolbar-icon-clicking i{text-shadow:0 0 2px #666}.customize-toolbar-pic-move{animation:rotate-y 4s linear infinite normal;transform-origin:50% 50%}.customize-toolbar-hide{opacity:0;transform:translateX(10px)}.customize-toolbar-hide-all{right:-160px}.customize-toolbar-hide-tip{transform:translateY(205px);opacity:0}.customize-toolbar-pic-bg-move{animation:rotate-own 4s linear infinite normal;transform-origin:50% 50%}@keyframes rotate-y{0%{transform:rotateY(0)}25%{transform:rotateY(90deg)}50%{transform:rotateY(180deg)}75%{transform:rotateY(270deg)}100%{transform:rotateY(360deg)}}@keyframes rotate-own{0%{transform:rotate(0)}25%{transform:rotate(90deg)}50%{transform:rotate(180deg)}75%{transform:rotate(270deg)}100%{transform:rotate(360deg)}}.customize-toolbar-core{background-image:var(--main-bg-img-css);background-repeat:no-repeat;background-position:center;background-size:cover;width:160px;height:160px;margin:20px}.customize-toolbar-topline{width:2px;height:calc(100vh - var(--tb-bottom));background:#000;position:absolute;bottom:var(--tb-bottom);left:100px}.customize-toolbar-topdot{position:absolute;left:96.5px;bottom:var(--tb-bottom);width:8px;height:8px;background-color:var(--main-font-color);border:1px solid #000;border-radius:50%;z-index:2}.customize-toolbar-menu{position:absolute;width:300px;height:300px;top:-50px;left:-50px;display:flex;justify-content:center;align-items:center;border-radius:50%}.customize-toolbar-icon-set{position:inherit;left:0;width:100px;height:200px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;transition:all .5s linear;z-index:2}.customize-toolbar-icon{position:relative;border-radius:50%}.customize-toolbar-icon i{text-shadow:1px 1px 1px #666;cursor:pointer!important}.customize-toolbar-icon:nth-child(2),.customize-toolbar-icon:nth-child(3){right:30px}.customize-toolbar-icon:nth-child(4) i{font-weight:700}.customize-toolbar-icon-func,.customize-toolbar-icon-tip{color:var(--main-font-color);border-color:var(--main-border-shadow-color);background:var(--main-bg-color);box-sizing:border-box;border-style:solid;transition:all .5s linear}.customize-toolbar-icon-func{width:30px;height:30px;border-width:2px;border-radius:50%;line-height:26px;text-align:center;box-shadow:0 0 5px var(--main-border-shadow-color);cursor:pointer!important}.customize-toolbar-icon-func.customize-toolbar-icon-clicking,.customize-toolbar-icon-func:hover{background:var(--main-bg-hover-color);color:var(--main-bg-color)}.customize-toolbar-icon-func:hover+.customize-toolbar-icon-tip{opacity:1;right:40px}.customize-toolbar-icon-tip{right:100px;bottom:0;position:absolute;white-space:nowrap;font-size:.85rem;line-height:28px;padding:0 8px;font-family:Calibri,sans-serif;letter-spacing:.5px;border-radius:5px;border-width:1px;transform:none;box-shadow:0 0 6px #333;opacity:0}.customize-toolbar-icon:nth-child(1) .customize-toolbar-icon-tip{border-top-left-radius:15px}.customize-toolbar-icon:nth-child(4) .customize-toolbar-icon-tip{border-bottom-left-radius:15px}.customize-toolbar-blank{width:200px;height:200px;background:rgba(255,255,255,.2);border-radius:50%;box-shadow:0 0 10px #fff;position:relative}.customize-toolbar-blank>div{width:inherit;height:inherit;position:inherit}.customize-toolbar-blank-bg{font-size:170px;text-align:center;line-height:200px;color:#ffffe0;opacity:.5;z-index:-1;display:flex;align-items:center;justify-content:center;}.customize-toolbar-blank-tip{top:-200px;text-align:center}.customize-toolbar-blank-tip>div{display:inline-block;padding:10px;background:#333;color:#eee;border-radius:10px;font-size:.85rem;box-shadow:0 0 5px gray;transition:all 1s linear;position:relative;z-index:2}.customize-toolbar-blank:hover i{animation:rotate-own 4s linear infinite normal}@media(max-width:800px){#wp-toolbar-customize{display:none}}",
			dom = document.createElement("div"),
			css = document.createElement("style");
		dom.setAttribute("id", "wp-toolbar-customize");
		dom.innerHTML = toolbar_html;
		css.innerHTML = toolbar_css;
		document.body.appendChild(dom);
		document.head.appendChild(css);
		this.render();
	}
	init() {
		//author info
		console.log(
			"小工具挂件：版本v2.0 | 小流星 https://www.littlemeteor.me"
		);
		//check fontawesome
		var links = document.getElementsByTagName("link"),
			arr = [],
			len = links.length,
			f = -1;
		Object.keys(links).forEach(function (key) {
			arr.push(links[key]);
		});
		for (var i = 0; i < len; i++) {
			if (arr[i].href.includes("font-awesome")) {
				f = i;
				break;
			}
		}
		if (f == -1) {
			var fas = document.createElement("link");
			fas.rel = "stylesheet";
			fas.href =
				"https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css";
			document.body.appendChild(fas);
		}
		//set loading tip
		var con = "",
			sty =
				"text-align:center;position:fixed;z-index:100;top:0;left:0;opacity:1;transition:opacity 0.5s linear;width:100%;",
			inn = [
				'<div style="display:inline-block;box-shadow:0 0 3px gray;padding:3px 5px;border-radius:5px;font-size:12px;font-family:sans-serif;line-height:20px;background:#fff;max-width:80%;margin-top:5px;"><span style="margin-right:5px;color:orange;"><i class="fa fa-exclamation-circle"></i></span><span>',
				"</span></div>",
			],
			tip = document.createElement("div");
		tip.setAttribute("style", sty);
		//do not load under mobile environment if mobileVisibility property is 0
		if (this.mv == 0) {
			if (/iPad|iPhone|Android/.test(navigator.userAgent)) {
				con = "检测到移动设备，未启用右下角挂件装饰";
				tip.innerHTML = inn.join(con);
				document.body.appendChild(tip);
				window.addEventListener("load", function () {
					setTimeout(function () {
						tip.style.opacity = 0;
					}, 3000);
				});
				return;
			}
		}
		con = "挂件装饰正在加载";
		tip.innerHTML = inn.join(con);
		document.body.appendChild(tip);
		window.addEventListener("load", function () {
			setTimeout(function () {
				tip.style.opacity = 0;
			}, 3000);
		});
		//default configuration
		this.theme["font-color"] ? {} : (this.theme["font-color"] = "coral");
		this.theme["bg-color"] ? {} : (this.theme["bg-color"] = "beige");
		this.theme["border-shadow-color"]
			? {}
			: (this.theme["border-shadow-color"] = "lightcoral");
		this.theme["bg-hover-color"]
			? {}
			: (this.theme["bg-hover-color"] = "lightpink");
		this.theme["bg-img-css"]
			? {}
			: (this.theme["bg-img-css"] =
					"url(https://cdn.jsdelivr.net/gh/littlestar520521/wordpress-backup@1.2.1/assets/bad27a027fff5ca54756c7da2e6cc756_optimized.png)");
		this.mv ? {} : (this.mv = 0);
		this.load();
	}
}

var x = new ToolBar(toolbar_opt);
x.init();