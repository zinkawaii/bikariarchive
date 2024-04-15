interface GetReadRecordResponse extends BaseResponse {
    data?: any[]
}

export default defineCustomHandler<GetReadRecordResponse>(async (event, res) => {
    const query = getQueryValues(event);

    //权限验证
    identityValidate(event, 9);

    let from = Number.parseInt(query.from);
    let to = Number.parseInt(query.to);

    //<from>始终小于<to>
    if (from > to) [from, to] = [to, from];

    if ((from ^ to) > 0 || to === 0) {
        const sort = from < 0 ? -1 : 1;
        const count = to - from;
        const skip = from >= 0 ? from : Math.abs(to);

        if (count > 0) {
            res.data = await ReadRecordModel.find()
            .sort({ _id: sort })
            .skip(skip)
            .limit(count)
            .populate({ path: "user", select: "uid" });
        }
    }
    else {
        //符号不一致
        res.error = 1;
    }
});