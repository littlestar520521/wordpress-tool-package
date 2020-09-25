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

var an = document.getElementById("customize-article-navigator");

document
	.querySelector(".customize-an-collapse>div")
	.addEventListener("click", function () {
		an.classList.toggle("customize-an-hide");
	});
