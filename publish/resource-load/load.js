/**
 * 资源加载前检测
 */
(function (t, h, u) {
	const site = "https://www.littlemeteor.me/";
	if (t.startsWith("Access denied")) return;
	if (h.startsWith(`${site}wp-`)) return;
	var sty =
		"text-align:center;position:fixed;z-index:100;top:0;left:0;opacity:1;transition:opacity 0.5s linear;width:100%;",
		inn = [
			'<div style="display:inline-block;box-shadow:0 0 3px gray;padding:3px 5px;border-radius:5px;font-size:12px;font-family:sans-serif;line-height:20px;background:#fff;max-width:80%;margin-top:5px;"><span style="margin-right:5px;color:orange;"><i class="fa fa-exclamation-circle"></i></span><span>',
			"</span></div>",
		],
		tip = document.createElement("div"),
		logo = `${site}"wp-content/uploads/2020/03/cropped-c5ce356fe6911ec8d799a22faa36eebb_optimized@v3-1.png}`,
		text = [
			"检测到移动设备，为节省资源，未启用个性化外观",
			"个性化外观正在后台加载",
		],
		ver = "2.0",
		pre = `https://cdn.jsdelivr.net/gh/littlestar520521/wordpress-tool-package@${ver}/publish/combine/dist/`,
		loadRes = function () {
			var c = document.createElement('link');
			c.rel = "stylesheet";
			c.href = `${pre}extra.min.css`;
			var s = document.createElement("script");
			s.src = `${pre}extra.min.js`;
			s.async = true;
			document.head.appendChild(c);
			document.body.appendChild(s);
		}
		/* loadRes = function () {
			var s1 = document.createElement("script");
			s1.src =
				"https://cdn.jsdelivr.net/gh/xb2016/kratos-pjax@0.3.6/static/js/live2d.js";
			s1.onload = function () {
				var s2 = document.createElement("script");
				s2.src = `https://cdn.jsdelivr.net/gh/littlestar520521/wordpress-tool-package@${ver}/publish/combine/dist/tool-package.min.js`;
				s2.async = true;
				document.body.appendChild(s2);
			};
			document.body.appendChild(s1);
		}; */
	tip.setAttribute("style", sty);
	if (/iPad|iPhone|Android/.test(u)) {
		tip.innerHTML = inn.join(text[0]);
		document.body.appendChild(tip);
		document.body.style.backgroundColor = "lightyellow";
		document.body.style.setProperty("--article-bg-color", "#fff");
		document.getElementById("day-night-theme-image").setAttribute("src", logo);
		document.getElementById('customize-toolbar').classList.add('customize-mobile-hidden');
		document.getElementById('customize-article-navigator').classList.add('customize-mobile-hidden');
	} else {
		tip.innerHTML = inn.join(text[1]);
		document.body.appendChild(tip);
		//个性化配置信息缓存时间为浏览器会话时长，浏览器关闭再打开，则重新拉取最新配置内容
		//获取个性化配置信息缓存入本地
		var cusCache = sessionStorage.getItem("customization-cache");
		if (cusCache) {
			window.customizeThemeOpt = JSON.parse(cusCache);
			loadRes();
		} else {
			var cusHeader = new Headers();
			cusHeader.append("x-token", "123456");
			var cusInit = { headers: cusHeader };
			fetch(`${site}api/customization`, cusInit)
				.then(function (data) {
					return data.json();
				})
				.then(function (json) {
					window.customizeThemeOpt = json;
					sessionStorage.setItem(
						"customization-cache",
						JSON.stringify(json)
					);
					loadRes();
				})
				.catch(function (error) {
					console.log(error.message);
				});
		}
	}
	window.addEventListener("load", function () {
		setTimeout(function () {
			tip.style.opacity = 0;
		}, 3000);
	});
})(document.title, location.href, navigator.userAgent);
