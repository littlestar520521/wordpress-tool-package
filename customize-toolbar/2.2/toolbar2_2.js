/*
 * 最新版工具栏挂件（我自己用的版本）
 * 包含功能：Bing壁纸、背景音乐、切换白天/夜间外观、回到顶部
 * 新增功能：挂件整体可隐藏/显示，表明时间的太阳/星星图案根据主题色调整颜色
 * version：2.2
 */
const THEME_OPT = {
	toolbarTheme: {
		//coral
		"font-color": "#ff7f50",
		//beige
		"bg-color": "#f5f5dc",
		//lightcoral
		"border-shadow-color": "#f08080",
		//lightpink
		"bg-hover-color": "#ffb6c1",
		"bg-img-css":
			"url(https://wp-cdn.bozaiq.cn/uni/images/backgrounds/classical/38692245e2399f647d0eea3fa8d2647c.png)",
		"bg-pattern-color": ["#eee", "#aaa"],
	},
	siteTheme: {
		dayTheme: {
			image:
				"https://wp-cdn.bozaiq.cn/uni/images/inserts/2c9883c0c3d7b75e0a3feee8354ddd9b_optimized.png",
			css: {
				//wp小工具背景色
				"--widget-bg-color": "rgba(250,250,250,0.8)",
				///wp小工具字体颜色
				"--widget-font-color": "initial",
				//wp小工具标题颜色
				"--widget-title-color": "initial",
				//wp小工具列表项数字颜色
				"--widget-list-item-color": "initial",
				//导航栏蒙版背景色
				"--nav-mask-bg-color": "unset",
				//文章区域背景色
				"--article-bg-color": "#fff",
				//全局a元素颜色
				"--global-link-color": "#789",
			},
		},
		nightTheme: {
			image:
				"https://wp-cdn.bozaiq.cn/uni/images/inserts/56f8dc7323d843977ec483846d01be74.png",
			css: {
				//wp小工具背景色
				"--widget-bg-color": "#333",
				//wp小工具字体颜色rosybrown
				"--widget-font-color": "#bc8f8f",
				//wp小工具标题颜色lightcoral
				"--widget-title-color": "#f08080",
				//wp小工具列表项数字颜色bisque
				"--widget-list-item-color": "#ffe4c4",
				//导航栏蒙版背景色
				"--nav-mask-bg-color": "#222",
				//文章区域背景色
				"--article-bg-color": "#222",
				//全局a元素颜色rosybrown
				"--global-link-color": "#bc8f8f",
			},
		},
	},
	bgm: {
		url: "https://wp-cdn.bozaiq.cn/uni/sounds/snowdream_202051324111.mp3",
		length: 293,
	},
	bingImageApi: {
		url: "https://www.littlemeteor.me/api/bingwallpaper",
		token: "",
	},
};
const hour = new Date().getHours();
const nonce = Math.random().toString().substring(2);
var t = {
	/**
	 * tip text
	 */
	t: {
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
	/**
	 * class list
	 */
	c: {
		/**
		 * visibility class
		 */
		v: {
			toolBarHide: "customize-toolbar-hide-all",
			menuHide: "customize-toolbar-hide",
			iconClick: "customize-toolbar-icon-clicking",
			maskHide: "customize-toolbar-window-mask-hide",
		},
		/**
		 * rotation class
		 */
		r: {
			picMove: "customize-toolbar-pic-move",
			bgMove: "customize-toolbar-pic-bg-move",
		},
		/**
		 * icon class
		 */
		i: {
			dayIcon: "fa fa-tree",
			dayBg: "fa fa-sun-o",
			nightBgAndIcon: "fa fa-star",
			bgmPlay: "fa fa-play",
			bgmPause: "fa fa-pause",
		},
		/**
		 * wallpaper class
		 */
		w: {
			start: "customize-wallpaper-bg-start",
			end: "customize-wallpaper-bg-end",
		},
		/**
		 * site theme class
		 */
		t: {
			day: "body-bg-day",
			night: "body-bg-night",
		},
	},
	/**
	 * dom list
	 */
	d: {
		/**
		 * root dom of toolbar (id)
		 */
		t: "customize-toolbar-" + nonce,
		/**
		 * bgm audio dom (id)
		 */
		s: "customize-toolbar-bgm-" + nonce,
		/**
		 * button dom
		 */
		b: {
			bingImageButton: '[data-func="bing-wallpaper"]>div:first-child',
			bgmControlButton: '[data-func="bgm-controller"]>div:first-child',
			backToTopButton: '[data-func="back-to-top"]>div:first-child',
			closeMenuButton: '[data-func="hide-menu"]>div:first-child',
			shiftThemeButton: '[data-func="shift-theme"]>div:first-child',
		},
		/**
		 * pic dom
		 */
		p: ".customize-toolbar-core",
		/**
		 * blank area dom
		 */
		a: ".customize-toolbar-blank",
		/**
		 * menu dom
		 */
		m: ".customize-toolbar-icon-set",
		/**
		 * pop tip dom
		 */
		e: ".customize-toolbar-blank-tip>div",
	},
	/**
	 * Get Dom
	 * @param {string} s
	 * @param {boolean} id is id? default is false
	 */
	getDom(s, id = false) {
		return id ? document.getElementById(s) : document.querySelector(s);
	},
	/**
	 * toggle css class
	 * @param {Element} d dom
	 * @param {string} c class name
	 * @param {boolean} r confirm remove class?
	 */
	toggleCssClass(d, c, r) {
		r ? d.classList.remove(c) : d.classList.add(c);
	},
	/**
	 * pop error tip
	 * @param {string} t1 show alert
	 * @param {string} t2 console log
	 */
	popErrorLog(t1, t2) {
		var l = this.getDom(".customize-toolbar-blank-tip>div");
		l.innerHTML = t1;
		l.classList.remove("customize-toolbar-hide-tip");
		this.switchPicAnimation(true); //stop pic rotation
		console.error(t2);
		setTimeout(function () {
			l.classList.add("customize-toolbar-hide-tip");
		}, 3000);
	},
	/**
	 * switch toolbar img animation
	 * @param {boolean} r confirm stop?
	 */
	switchPicAnimation(r) {
		this.toggleCssClass(this.getDom(this.d.p), this.c.r.picMove, r);
	},
	/**
	 * set day/night site theme
	 * @param {number} t time, 1=day, 0=night
	 * @param {HTMLBodyElement} b
	 */
	setSiteTheme(t, b) {
		if (t) {
			Object.keys(THEME_OPT.siteTheme.dayTheme.css).forEach(function (
				cssKey
			) {
				b.style.setProperty(
					cssKey,
					THEME_OPT.siteTheme.dayTheme.css[cssKey]
				);
			});
			b.classList.remove(this.c.t.night);
			b.classList.add(this.c.t.day);
		} else {
			Object.keys(THEME_OPT.siteTheme.nightTheme.css).forEach(function (
				cssKey
			) {
				b.style.setProperty(
					cssKey,
					THEME_OPT.siteTheme.nightTheme.css[cssKey]
				);
			});
			b.classList.remove(this.c.t.day);
			b.classList.add(this.c.t.night);
		}
	},
	/**
	 * Set day/night toolbar theme after shifting from other theme
	 * @param {number} t time ,1=day, 0=night
	 * @param {HTMLElement} si shift-theme button icon
	 * @param {HTMLElement} s shift-theme button
	 * @param {HTMLElement} tb toolbar dom
	 */
	setToolbarTheme(t, si, s, tb) {
		if (t) {
			si.setAttribute("class", this.c.i.nightBgAndIcon);
			s.nextElementSibling.innerHTML = this.t.o[4];
			tb.style.setProperty(
				"--tb-bg-blank-color",
				THEME_OPT.toolbarTheme["bg-pattern-color"][0]
			);
		} else {
			si.setAttribute("class", this.c.i.dayIcon);
			s.nextElementSibling.innerHTML = this.t.o[5];
			tb.style.setProperty(
				"--tb-bg-blank-color",
				THEME_OPT.toolbarTheme["bg-pattern-color"][1]
			);
		}
	},
	/**
	 * set bing wallpaper
	 * @param {string} u wallpaper url
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
			b.classList.add(_this.c.w.start);
			setTimeout(function () {
				b.classList.add(_this.c.w.end);
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
	},
	getBingWallpaperFromCache() {
		var localCache = localStorage.getItem("today-bing-image");
		if (localCache) {
			var localObj = JSON.parse(localCache);
			if (new Date(localObj.time).getDate() !== new Date().getDate()) {
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
		cusHeader.append("x-token", THEME_OPT.bingImageApi.token);
		var cusInit = { headers: cusHeader },
			_this = this;
		fetch(THEME_OPT.bingImageApi.url, cusInit)
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
				localStorage.setItem("today-bing-image", JSON.stringify(s));
			})
			.catch(function (e) {
				_this.popErrorLog(_this.t.e[1], e);
			});
	},
	backToOriginBackground() {
		var b = document.body,
			_this = this;
		b.classList.remove(_this.c.w.end);
		setTimeout(function () {
			b.style.removeProperty("background-image");
			b.classList.remove(_this.c.w.start);
			_this.getDom(
				_this.d.b.bingImageButton
			).nextElementSibling.innerHTML = _this.t.o[2];
		}, 2000);
	},
};
var au = t.getDom(t.d.b.bgmControlButton),
	tb = t.getDom(t.d.t, true),
	s = t.getDom(t.d.b.shiftThemeButton),
	si = s.getElementsByTagName("i")[0],
	a = document.createElement("audio");
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
t.getDom(t.d.b.bingImageButton).addEventListener("click", function () {
	document.body.style.backgroundImage
		? t.backToOriginBackground()
		: t.getBingWallpaperFromCache();
});
t.getDom(t.d.a).addEventListener("click", function (e) {
	e.stopPropagation();
	t.getDom(t.d.m).classList.toggle(t.c.v.menuHide);
});
window.addEventListener("load", function () {
	t.getDom(t.d.m).classList.toggle(t.c.v.menuHide);
	var l = t.getDom(".customize-toolbar-blank-tip>div");
	l.classList.remove("customize-toolbar-hide-tip");
	setTimeout(function () {
		l.classList.add("customize-toolbar-hide-tip");
	}, 10000);
});
s.addEventListener("click", function () {
	var b = document.body;
	//switch to night theme if body element has 'body-bg-day' class
	if (b.classList.contains(t.c.t.day)) {
		t.setSiteTheme(0, b);
		//change the shift-theme button icon and tip
		//change the bg pattern color
		t.setToolbarTheme(0, si, s, tb);
		//cache the preferred theme
		localStorage.setItem("preferred-theme", "n");
	}
	//switch to day theme if body element has 'body-bg-night' class
	else {
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
		au.getElementsByTagName("i")[0].setAttribute("class", t.c.i.bgmPause);
		au.nextElementSibling.innerHTML = t.t.o[1];
	} else {
		d.pause();
		au.getElementsByTagName("i")[0].setAttribute("class", t.c.i.bgmPlay);
		au.nextElementSibling.innerHTML = t.t.o[0];
	}
});
a.setAttribute("data-length", THEME_OPT.bgm.length);
a.setAttribute("data-url", THEME_OPT.bgm.url);
a.setAttribute("id", t.d.s);
a.loop = true;
document.body.appendChild(a);
//set toolbar appearance
//set site appearance
Object.keys(THEME_OPT.toolbarTheme).forEach(function (cssKey) {
	tb.style.setProperty("--tb-" + cssKey, THEME_OPT.toolbarTheme[cssKey]);
});
//get user preferred theme, if it exists, then use the preferred option
var pt = localStorage.getItem("preferred-theme");
//day time
if (hour >= 6 && hour <= 18) {
	//if preferred option exists, the toolbar button should also be updated to follow the preferred theme
	if (pt == "n") {
		t.setSiteTheme(0, document.body);
		t.setToolbarTheme(0, si, s, tb);
	} else {
		t.setSiteTheme(1, document.body);
		t.setToolbarTheme(1, si, s, tb);
	}
	t.getDom("day-night-theme-image", true).setAttribute(
		"src",
		THEME_OPT.siteTheme.dayTheme.image
	);
	t.getDom(t.d.a)
		.getElementsByTagName("i")[0]
		.setAttribute("class", t.c.i.dayBg);
}
//night time
else {
	if (pt == "d") {
		t.setSiteTheme(1, document.body);
		t.setToolbarTheme(1, si, s, tb);
	} else {
		t.setSiteTheme(0, document.body);
		t.setToolbarTheme(0, si, s, tb);
	}
	t.getDom("day-night-theme-image", true).setAttribute(
		"src",
		THEME_OPT.siteTheme.nightTheme.image
	);
	t.getDom(t.d.a)
		.getElementsByTagName("i")[0]
		.setAttribute("class", t.c.i.nightBgAndIcon);
}
