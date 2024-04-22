import CryptoES from "crypto-es";

interface GetCommentsResponse extends BaseResponse {
    totalCount?: number;
    mainCount?: number;
    data?: any[];
}

//需要获取的属性
const select = "_id content children time nickname email address";

export default defineWrappedHandler<GetCommentsResponse>(async (event, res) => {
    let {
        path,
        page
    } = getQueryValues(event);

    //获取严格路径
    path = getStrictPath(path);

    //路径格式错误
    if (!path) {
        return 1;
    }

    //单页评论数
    const limit = 10;

    //总评论数
    res.totalCount = await CommentDataModel.countDocuments({
        path
    });

    //主评论数
    res.mainCount = await CommentDataModel.countDocuments({
        path,
        parent: null
    });

    //获取主评论
    const data = await CommentDataModel.find({
        path,
        parent: null
    }, select)
    .sort({ time: "desc" })
    .skip((Number(page) - 1) * limit)
    .limit(limit);

    //获取子评论
    await deference(data);

    res.data = [];
    dataClone(res.data, data);
});

//递归解引用
async function deference(parent) {
    for (const item of parent) {
        if (item.children.length > 0) {
            await item.populate({
                path: "children",
                select
            });
            await deference(item.children);
        }
    }
}

//递归处理数据
function dataClone(target, source) {
    for (const item of source) {
        const i = {
            id: item._id,
            children: [],
            content: item.content,
            time: item.time,
            nickname: item.nickname,
            avatar: `https://cravatar.cn/avatar/${CryptoES.MD5(item.email)}?d=404`,
            address: item.address
        };
        target.push(i);
        if (item.children.length > 0) {
            dataClone(i.children, item.children);
        }
    }
}