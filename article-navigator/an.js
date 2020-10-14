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
var blockArea = document.querySelector(".an-block-container");
/**
 * scroll bar
 */
var scrollBar = document.querySelector(".an-scroller-progress");
/**
 * css customize properties
 */
var cssPros = [
	"--an-scroll-bar-len",
	"--an-scroll-bar-move",
	"--an-blocks-area-move",
];

//use closures to protect core private variables
function coreSizeValue() {
	//values cannot be rewrite maliciously out of the closure
	var list = {
			//container height + self height
			blocks: [0, 0],
			//container length + self length
			bar: [0, 0],
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
		refresh = function () {
			list.blocks[0] = parseInt(
				window
					.getComputedStyle(blockArea.parentElement)
					.height.match(/\d*/)
			);
			list.blocks[1] = parseInt(
				window.getComputedStyle(blockArea).height.match(/\d*/)
			);
			list.bar[0] = parseInt(
				window
					.getComputedStyle(scrollBar.parentElement)
					.height.match(/\d*/)
			);
			list.bar[1] = (list.bar[0] * list.blocks[0]) / list.blocks[1];
		};
	return {
		blocks: blocksHeight,
		bar: barLength,
		update: refresh,
	};
}
var sizeObj = coreSizeValue();
//initialize the size data
sizeObj.update();

/**
 * calculate the block area move distance
 * @param {number} barMove scroll bar move distance
 */
function getBlocksMoveLength(barMove) {
	return (
		(barMove * (sizeObj.blocks.self - sizeObj.blocks.con)) /
		(sizeObj.bar.con - sizeObj.bar.self)
	);
}

anRoot.style.setProperty(cssPros[0], sizeObj.bar.self + "px");

/**
 * store last mouse location & deltaY value & max scroll bar moved length
 */
var temps = {
	mY: 0,
	wY: 0,
	d: sizeObj.bar.con - sizeObj.bar.self
};

blockArea.addEventListener("wheel", function (e) {
	wheelHandler(e);
});
scrollBar.parentElement.addEventListener("wheel", function (e) {
	wheelHandler(e);
});

/**
 * wheel event handler
 * @param {WheelEvent} e
 */
function wheelHandler(e) {
	//set the total deltaY value as scroll bar moved length
	//temps.wY + e.deltaY > temps.d || temps.wY < -e.deltaY
	if (temps.wY + e.deltaY <= temps.d && temps.wY >= -e.deltaY) {
		temps.wY += e.deltaY;
	} else if (temps.wY < temps.d && temps.wY > -e.deltaY) {
		temps.wY = temps.d;
	} else if (temps.wY < -e.deltaY && temps.wY > 0) {
		temps.wY = 0;
	} else {
		return;
	}
	anRoot.style.setProperty(cssPros[1], temps.wY + "px");
	anRoot.style.setProperty(cssPros[2], getBlocksMoveLength(temps.wY) + "px");
}
