import { exec } from "node:child_process";
import consola from "consola";
import dayjs from "dayjs";
import schedule from "node-schedule";

export default defineNitroPlugin(() => {
    const config = useRuntimeConfig();
    const { options } = config.mongoose;

    const rule = new schedule.RecurrenceRule();

    //每个星期天的23:33
    rule.dayOfWeek = 0;
    rule.hour = 23;
    rule.minute = 33;
    rule.tz = "UTC+8";

    schedule.scheduleJob(rule, () => {
        //获取当前日期
        const date = dayjs.tz();

        //备份路径
        const path = r(`server/backup/${date.format("YYMMDD")}.archive`);

        //运行命令
        exec(`mongodump -u=${options.user} -p=${options.pass} -d=${options.dbName} --archive="${path}" --authenticationDatabase admin`, (err) => {
            if (err) {
                consola.error(err);
            }
            else {
                consola.success("数据库备份成功！");
            }
        });
    });
});