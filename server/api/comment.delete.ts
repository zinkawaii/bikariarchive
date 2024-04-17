interface DeleteCommentBody {
    id: string
}

export default defineWrappedHandler(async (event, res) => {
    const { id } = await readBody<DeleteCommentBody>(event);

    //权限验证
    identityValidate(event, 9);

    //删除评论
    await CommentDataModel.deleteOne({
        _id: id
    });

    //删除作为子评论的引用
    await CommentDataModel.findOneAndUpdate({
        children: {
            $in: [id]
        }
    }, {
        $pull: {
            children: id
        }
    });
});