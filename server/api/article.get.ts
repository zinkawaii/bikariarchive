import dayjs from "dayjs";
import fs from "fs-extra";
import { defineCustomHandler } from "../utils/handler";
import getQueryValues from "../utils/getQueryValues";

interface GetArticleResponse extends BaseResponse {
    content?: string,
    readCount?: number
}

export default defineCustomHandler(async (event) => {
    const res: GetArticleResponse = { error: 0 };
    const { novel, volOrder, index } = getQueryValues(event);

    if (novel) {
        const path = `dist/novel/${novel[0].toUpperCase() + novel.slice(1)}.${volOrder}/${index}.txt`;
        const isExist = await fs.exists(path);

        if (isExist) {
            //读取文章
            const file = await fs.readFile(path);
            res.content = file.toString();

            //获取阅读量
            const result = await ReadRecordModel.find({
                novel,
                index
            }, "ip time");

            //处理阅读量
            const interval = 8 * 60 * 60 * 1000;
            const rlist: {
                [T: string]: {
                    count: number,
                    time: Date
                }
            } = {};
            result.forEach((record: any) => {
                const ip = record.ip;
                if (ip in rlist) {
                    const next: Date = record.time;
                    const last = rlist[ip].time;

                    //同IP下阅读间隔大于8小时
                    if ((next.getTime() - last.getTime()) >= interval) {
                        rlist[ip].count++;
                        rlist[ip].time = next;
                    }
                }
                else {
                    rlist[ip] = {
                        count: 1,
                        time: record.time
                    };
                }
            });

            //统计阅读量
            res.readCount = 0;
            for (const ip in rlist) {
                res.readCount += rlist[ip].count;
            }

            (async () => {
                //获取时间，UID
                const time = dayjs.tz();
                const uid = event.context.sessions?.uid;

                //获取用户
                const user = await UserDataModel.findOne({ uid });

                //将阅读记录写入数据库
                ReadRecordModel.create({
                    ip: getRequestIP(event, { xForwardedFor: true }),
                    time,
                    novel,
                    index,
                    user: user?.id
                });
            })();
        }
        else {
            res.error = 2;
        }
    }
    else {
        res.error = 1;
    }

    return res;
});