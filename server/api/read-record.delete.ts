export default defineCustomHandler(async (event) => {
    const res: BaseResponse = { error: 0 };
    const { id } = await readBody(event);

    //权限验证
    identityValidate(event, 9);

    try {
        await ReadRecordModel.deleteOne({
            _id: id
        });
    }
    catch (err) {
        //ID不存在
        res.error = 1;
    }

    return res;
});