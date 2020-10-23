/**
 * 标题列表样式1
 */
const nav1 = [
	{
		title: "潜入饭店",
		list: [
			{
				t: "第1章",
				a: "chapter1",
			},
			{
				t: "第2章",
				a: "chapter2",
			},
		],
	},
	{
		title: "开始搜查",
		list: [
			{
				t: "第2-3章",
				a: "chapter2-3",
			},
			{
				t: "第2-4章",
				a: "chapter2-4",
			},
		],
	},
];
/**
 * 标题列表样式2
 */
const nav2 = [
	{
		title: "潜入饭店",
		list: [1, 2],
	},
	{
		title: "开始搜查",
		list: ["2-3", "2-4"],
	},
];
/**
 * 视觉切换逻辑：
 * 初始/隐藏状态[an-hide-all, an-close-side]
 * |
 * 移除[an-hide-all]->0.5s->移除[an-close-side]->0.5s->添加[an-show-all]
 * |
 * 正常显示状态[an-show-all]
 * |
 * 移除[an-show-all]->添加[an-close-side]->0.5s->添加[an-hide-all]
 * |
 * 隐藏状态[an-hide-all, an-close-side]
 */
/**
 * 滚动条逻辑：窗口高度、页面总长度都是常量
 * 滚动条长度/窗口高度=窗口高度/页面总长度
 * 滚动条移动距离/滚动条可移动的总距离=页面卷起长度/页面可卷起的总长度
 * =>
 * 滚动条移动距离/(窗口高度-滚动条长度)=页面卷起长度/(页面总长度-窗口高度)
 */
/**
 * navigator root dom
 */
var anRoot = document.getElementById("customize-article-navigator");
/**
 * nav blocks area
 */
var blockArea = document.querySelector(".an-block-container"),
	blockAreaCon = blockArea.parentElement;
/**
 * scroll bar
 */
var scrollBar = document.querySelector(".an-scroller-progress"),
	scrollBarCon = scrollBar.parentElement;

/**
 * css customize properties
 */
var cssPros = [
	"--an-scroll-bar-len",
	"--an-scroll-bar-move",
	"--an-blocks-area-move",
];
/**
 * visibility class list
 */
var vClass = [
	"an-hide-all",
	"an-close-side",
	"an-show-all",
	"an-scroller-show",
	"an-no-equal-height"
];

//use closures to protect core private variables
function coreSizeValue() {
	//values cannot be rewrite maliciously out of the closure
	var list = {
			//container height + self height
			blocks: [0, 0],
			//container length + self length
			bar: [0, 0],
			//window size, width + height
			win: [0, 0],
			//an size, width + min height
			an: [262, 119],
		},
		anSize = {
			/**
			 * an width
			 */
			get width() {
				return list.an[0];
			},
			/**
			 * an min height
			 */
			get minHeight() {
				return list.an[1];
			},
		},
		blocksHeight = {
			/**
			 * blocks area container height
			 */
			get con() {
				return list.blocks[0];
			},
			/**
			 * total blocks area height
			 */
			get self() {
				return list.blocks[1];
			},
		},
		barLength = {
			/**
			 * scroll bar container length
			 */
			get con() {
				return list.bar[0];
			},
			/**
			 * scroll bar length
			 */
			get self() {
				return list.bar[1];
			},
		},
		winSize = {
			/**
			 * window width
			 */
			get width() {
				return list.win[0];
			},
			/**
			 * window height
			 */
			get height() {
				return list.win[1];
			},
		},
		refresh = function () {
			// var a = window
			// 		.getComputedStyle(blockAreaCon)
			// 		.height.match(/\d*/)[0],
			// 	b = window.getComputedStyle(blockArea).height.match(/\d*/)[0],
			// 	c = window
			// 		.getComputedStyle(scrollBarCon)
			// 		.height.match(/\d*/)[0];
			// list.blocks[0] = a.length > 0 ? parseInt(a) : 0;
			// list.blocks[1] = b.length > 0 ? parseInt(b) : 0;
			// list.bar[0] = c.length > 0 ? parseInt(c) : 0;
			list.blocks[0] = blockAreaCon.getBoundingClientRect().height;
			list.blocks[1] = blockArea.getBoundingClientRect().height;
			list.bar[0] = scrollBarCon.getBoundingClientRect().height;
			list.bar[1] = list.blocks[1]
				? (list.bar[0] * list.blocks[0]) / list.blocks[1]
				: 0;
			list.win[0] = window.innerWidth;
			list.win[1] = window.innerHeight;
			console.table(list.blocks);
			console.table(list.bar);
			console.table(list.win);
		};
	return {
		an: anSize,
		blocks: blocksHeight,
		bar: barLength,
		win: winSize,
		update: refresh,
	};
}
var sizeObj = coreSizeValue();
//initialize the size data
sizeObj.update();

/**
 * store some temporary data
 */
var temps = {
	/**
	 * last wheel time
	 */
	t: 0,
	/**
	 * total deltaY value
	 */
	y: 0,
	/**
	 * max scroll bar moved length
	 */
	d: sizeObj.bar.con - sizeObj.bar.self,
	/**
	 * wheel event triggered observer
	 */
	wob: 0,
	/**
	 * resize event throttler
	 */
	rt: 0,
	/**
	 * indicate that if the window is resized when the navigator is closed
	 */
	rc: false
};

/**
 * calculate the block area move distance
 * @param {number} move scroll bar moved length
 */
function getBlocksMoveLength(move) {
	return (
		(move * (sizeObj.blocks.self - sizeObj.blocks.con)) /
		(sizeObj.bar.con - sizeObj.bar.self)
	);
}
/**
 * set scroll bar length
 * @param {number} len length value
 */
function setScrollBarLen(len) {
	anRoot.style.setProperty(cssPros[0], len + "px");
}
/**
 * set scroll bar y position
 * @param {number} move scroll bar moved length
 */
function setScrollBarPos(move) {
	anRoot.style.setProperty(cssPros[1], move + "px");
}
/**
 * set blocks area y position
 * @param {number} move scroll bar moved length
 */
function setBlocksAreaPos(move) {
	anRoot.style.setProperty(cssPros[2], getBlocksMoveLength(move) + "px");
}
/**
 * check if the scroll bar is needed, when blocks area height <= blocks area container height, the scroll bar is not needed, true=needed | false=not needed
 */
function isScrollBarNeeded() {
	return sizeObj.blocks.con < sizeObj.blocks.self ? true : false;
}
/**
 * show navigator
 */
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
/**
 * close navigator
 */
function closeNavigator() {
	var t = anRoot.classList;
	t.remove(vClass[2]);
	t.add(vClass[1]);
	setTimeout(function () {
		t.add(vClass[0]);
	}, 500);
}
/**
 * check if the navigator is hidden or shown, true=shown | false=hidden
 */
function isNavVisible() {
	if (anRoot.classList.contains(vClass[2])) {
		return true;
	}
	if (anRoot.classList.contains(vClass[0]) && anRoot.classList.contains(vClass[1])) {
		return false;
	}
}
/**
 * relayout blocks area and scroll bar after window being resized
 */
function reLayout() {
	sizeObj.update();
	if (sizeObj.win.width < sizeObj.an.width + 20 || sizeObj.win.height < sizeObj.an.minHeight + 25) {
		//output error
		console.error('window size is too small, the article navigator cannot be shown completely');
		//close the navigator
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
/**
 * wheel event handler
 * @param {WheelEvent} e event object
 */
function wheelHandler(e) {
	//set the total deltaY value as scroll bar moved length
	//temps.y + e.deltaY > temps.d || temps.y < -e.deltaY
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
/**
 * window resize event handler
 */
function resizeHandler() {
	//if the navigator is hidden, the sizeObj.update method cannot get its real size
	if (!isNavVisible()) {
		temps.rc = true;
		return;
	}
	reLayout();
}
blockArea.addEventListener("wheel", function (e) {
	scrollBarCon.classList.add(vClass[3]);
	//temps.t = new Date().getTime();
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
//TODO:how to check whether the wheel event is triggered?
/* blockAreaCon.addEventListener("mouseover", function () {
	//check whether the wheel event is triggered every 2s
	temps.wob = setInterval(function () {
		if (new Date().getTime() - temps.t > 2000) {
			scrollBarCon.classList.remove(vClass[3]);
		}
	}, 2000);
});
blockAreaCon.addEventListener("mouseout", function () {
	scrollBarCon.classList.remove(vClass[3]);
	clearInterval(temps.wob);
}); */
/**
 * shift visibility button
 */
document.querySelector(".bottom-cube-front>div").addEventListener("click", function () {
	//close if has 'an-show-all' class
	if (isNavVisible()) {
		closeNavigator();
	}
	//show it if has both 'an-hide-all' and 'an-close-side' class
	else if (!isNavVisible()) {
		showNavigator();
		//if the window has been resized, relayout the blocks area and scroll bar
		if (temps.rc) {
			reLayout();
			temps.rc = false;
		}
	}
});
//relayout and reposition scroll bar & blocks area when window is resized
//TODO:how to obtain the final size, instead of mid status?
window.addEventListener("resize", function () {
	//solution1: this way only handle the first resize event in every 500ms
	/* if (!temps.rt) {
		temps.rt = setTimeout(function () {
			temps.rt = 0;
			resizeHandler();
		}, 500);
	}	 */
	//solution2: if multiple resize event were triggered in 1000ms, only the last one can be handled
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