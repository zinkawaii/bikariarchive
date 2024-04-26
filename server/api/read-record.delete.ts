interface DeleteReadRecordBody {
    id: string;
}

export default defineJEventHandler(async (event) => {
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