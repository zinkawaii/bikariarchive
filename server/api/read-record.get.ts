interface GetReadRecordResponse extends BaseResponse {
    data?: any[];
}

export default defineWrappedHandler<GetReadRecordResponse>(async (event, res) => {
    const query = getQueryValues(event);

    //权限验证
    identityValidate(event, 9);

    let from = Number.parseInt(query.from);
    let to = Number.parseInt(query.to);

    //<from>始终小于<to>
    if (from > to) [from, to] = [to, from];

    //符号不一致
    if (to && (from ^ to) <= 0) {
        return 1;
    }

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
});