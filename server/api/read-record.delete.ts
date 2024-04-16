interface DeleteReadRecordBody {
    id: string
}

export default defineCustomHandler(async (event, res) => {
    const { id } = await readBody<DeleteReadRecordBody>(event);

    //权限验证
    identityValidate(event, 9);

    try {
        await ReadRecordModel.deleteOne({
            _id: id
        });
    }
    catch (err) {
        //ID不存在
        return 1;
    }
});