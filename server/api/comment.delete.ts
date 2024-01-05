interface DeleteCommentResponse extends BaseResponse {}

export default defineCustomHandler(async (event) => {
    const res: DeleteCommentResponse = { error: 0 };
    const {
        id
    } = await readBody(event);

    //权限验证
    identityValidate(event, 9);

    await CommentDataModel.deleteOne({
        _id: id
    });

    return res;
});