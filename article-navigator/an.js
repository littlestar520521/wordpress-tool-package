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
var blockArea = document.querySelector(".customize-an-block-container");
/**
 * scroll bar
 */
var scrollBar = document.querySelector(".customize-an-scroller-progress");
/**
 * css customize properties
 */
var cssPros = ["--an-scroll-bar-len", "--an-blocks-scroll-height"];
/**
 * block area container height
 */
const BLOCKS_CONTAINER_HEIGHT = parseInt(
	window.getComputedStyle(blockArea.parentElement).height.match(/\d*/)
);
/**
 * total block area height
 */
const BLOCKS_HEIGHT = parseInt(
	window.getComputedStyle(blockArea).height.match(/\d*/)
);
/**
 * scroll bar container length
 */
const SCROLL_BAR_CONTAINER_LEN = parseInt(
	window.getComputedStyle(scrollBar.parentElement).height.match(/\d*/)
);
/**
 * scroll bar length
 */
const SCROLL_BAR_LEN =
	(SCROLL_BAR_CONTAINER_LEN * BLOCKS_CONTAINER_HEIGHT) / BLOCKS_HEIGHT;
/**
 * calculate the block area move distance
 * @param {number} barMove scroll bar move distance
 */
function getBlocksMoveLength(barMove) {
	return (
		(barMove * (BLOCKS_HEIGHT - BLOCKS_CONTAINER_HEIGHT)) /
		(SCROLL_BAR_CONTAINER_LEN - SCROLL_BAR_LEN)
	);
}

anRoot.style.setProperty(cssPros[0], SCROLL_BAR_LEN + "px");

/**
 * store last mouse location
 */
var mouseLoc = {
	y: 0,
};
/**
 * a pointer that refer to the event listener function
 */
var listenerRef;
anRoot.addEventListener("mousedown", function (e) {
	this.style.background = "#333";
	mouseLoc.y = e.clientY;
	listenerRef = scrollBarMove.bind(this, e);
	this.addEventListener("mousemove", listenerRef);
});
anRoot.addEventListener("mouseup", function (e) {
	this.style.background = "#666";
	this.removeEventListener("mousemove", listenerRef);
});
anRoot.addEventListener("wheel", function () {});

/**
 *
 * @param {MouseEvent} ev
 */
function scrollBarMove(ev) {
	
}
