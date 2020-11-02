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
 * 标题列表样式3：
 * 当列表项内容有单位时，列表项简写为字符串数组
 */
const nav3 = {
    /**
     * 块级标题单位
     */
    ut: '章',
    /**
     * 列表项内容单位，可没有
     */
    un: '章',
    data: [
        {
            /**
             * 块级标题
             */
            title: {
                n: '1-3',//number
                c: '潜入饭店（新田浩介篇）'//content
            },
            /**
             * 列表项
             */
            list: ['1', '2', '3'],
            list_0: ['1-1', '1-2', '1-3'],
            list_1: [1, 2, 3],
            list_2: { s: 1, e: 3 },//start:xx,end:xx
            list_3: { s: '1-1', e: '1-11' },//start:1-1,end:1-11
        },
    ]
};
/**
 * 标题列表样式3：
 * 当列表项内容没有单位时，采用对象数组
 */
const nav3_1 = {
    /**
     * 块级标题单位
     */
    ut: '部分',
    /**
     * 列表项内容单位，可没有
     */
    un: '',
    data: [
        {
            /**
             * 块级标题
             */
            title: {
                n: '1',
                c: 'Security Services'
            },
            /**
             * 列表项
             */
            list: [
                {
                    t: 'Server Part',//title
                    m: 'server-security'//html mark
                },
                {
                    t: 'Client Part',
                    m: 'client-security'
                },
            ]
        },
    ]
}