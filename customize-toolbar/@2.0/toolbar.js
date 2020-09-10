const hour = new Date().getHours();
(function (THEME_OPT) {
	var toolbar = {
		/**
		 * tip text
		 */
		t: {
			o: [
				"播放背景音乐",
				"暂停背景音乐",
				"更换壁纸为Bing美图",
				"换回原来壁纸",
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
				dayBg: "fa fa-sun-o",
				nightBg: "fa fa-star",
				bgmPlay: "fa fa-play",
				bgmPause: "fa fa-pause",
			},
		},
		/**
		 * dom list
		 */
		d: {
			/**
			 * root dom of toolbar
			 */
			t: "#wp-toolbar-customize",
			/**
			 * button dom
			 */
			b: {
				bingImageButton: '[data-func="bing-wallpaper"]>div:first-child',
				bgmControlButton:
					'[data-func="bgm-controller"]>div:first-child',
				backToTopButton: '[data-func="back-to-top"]>div:first-child',
				closeMenuButton: '[data-func="hide-menu"]>div:first-child',
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
		 */
		getDom(s) {
			return document.querySelector(s);
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
		},
		getBingWallpaperFromCache() {
			var localCache = localStorage.getItem("today-bing-image");
			if (localCache) {
				var localObj = JSON.parse(localCache);
				if (
					new Date(localObj.time).getDate() !== new Date().getDate()
				) {
					this.getBingWallpaperFromServer();
				} else {
					this.switchPicAnimation(false);
					this.setBingWallpaper(localObj.url);
				}
			} else {
				this.getBingWallpaperFromServer();
			}
		},
		getBingWallpaperFromServer() {
			this.switchPicAnimation(false);
			var cusHeader = new Headers();
			if (THEME_OPT.bingImageApi.token) {
				cusHeader.append("x-token", THEME_OPT.bingImageApi.token);
			}
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
					_this.setBingWallpaper(r);
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
			b.classList.remove("bingwallpaper-bg-end");
			setTimeout(function () {
				b.style.removeProperty("background-image");
				b.classList.remove("bingwallpaper-bg-start");
				_this.getDom(
					_this.d.b.bingImageButton
				).nextElementSibling.innerHTML = _this.t.o[2];
			}, 2000);
		},
	};
	var t = toolbar,
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
		var d = document.querySelector("audio");
		if (!d.src) {
			d.src = d.getAttribute("data-url");
		}
		if (d.paused || d.played.length === 0) {
			d.play();
			i.setAttribute("class", t.c.i.bgmPause);
			au.nextElementSibling.innerHTML = t.t.o[1];
		} else {
			d.pause();
			i.setAttribute("class", t.c.i.bgmPlay);
			au.nextElementSibling.innerHTML = t.t.o[0];
		}
	});
	a.setAttribute("data-length", THEME_OPT.bgm.length);
	a.setAttribute("data-url", THEME_OPT.bgm.url);
	a.loop = true;
	document.body.appendChild(a);
	Object.keys(THEME_OPT.toolbarTheme).forEach(function (cssKey) {
		tb.style.setProperty(
			"--main-" + cssKey,
			THEME_OPT.toolbarTheme[cssKey]
		);
	});
	hour >= 6 && hour <= 18
		? t
				.getDom(t.d.a)
				.getElementsByTagName("i")[0]
				.setAttribute("class", t.c.i.dayBg)
		: t
				.getDom(t.d.a)
				.getElementsByTagName("i")[0]
				.setAttribute("class", t.c.i.nightBg);
})(window.customizeThemeOpt);
(function (THEME_OPT) {
	var dom = document.getElementById("time-period-greeting");
	if (dom) {
		var text;
		switch (true) {
			case hour >= 0 && hour < 6:
				text = "凌晨好";
				break;
			case hour >= 6 && hour <= 7:
				text = "早安";
				break;
			case hour > 7 && hour < 11:
				text = "上午好";
				break;
			case hour >= 11 && hour < 13:
				text = "中午好";
				break;
			case hour >= 13 && hour < 18:
				text = "下午好";
				break;
			case hour >= 18 && hour <= 21:
				text = "晚上好";
				break;
			case hour >= 22 && hour <= 23:
				text = "晚安";
				break;
		}
		dom.innerHTML = text + "，亲爱的访客";
	}
	var theme_image = document.getElementById("day-night-theme-image"),
		b = document.body;
	if (hour >= 6 && hour < 18) {
		b.classList.add("body-bg-day");
		Object.keys(THEME_OPT.siteTheme.dayTheme.css).forEach(function (
			cssKey
		) {
			b.style.setProperty(
				cssKey,
				THEME_OPT.siteTheme.dayTheme.css[cssKey]
			);
		});
		if (theme_image) {
			theme_image.setAttribute("src", THEME_OPT.siteTheme.dayTheme.image);
		}
	} else {
		b.classList.add("body-bg-night");
		Object.keys(THEME_OPT.siteTheme.nightTheme.css).forEach(function (
			cssKey
		) {
			b.style.setProperty(
				cssKey,
				THEME_OPT.siteTheme.nightTheme.css[cssKey]
			);
		});
		if (theme_image) {
			theme_image.setAttribute(
				"src",
				THEME_OPT.siteTheme.nightTheme.image
			);
		}
	}
})(window.customizeThemeOpt);
