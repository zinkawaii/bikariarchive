import { exec } from "node:child_process";
import consola from "consola";
import { CronJob } from "cron";
import dayjs from "dayjs";

export default defineNitroPlugin(() => {
    const config = useRuntimeConfig();
    const { options } = config.mongoose;

    const job = CronJob.from({
        cronTime: "0 33 23 * * 7",
        timeZone: "UTC+8",
        onTick() {
            //获取当前日期
            const date = dayjs.tz();

            //备份路径
            const path = r(`/server/backup/${date.format("YYMMDD")}.archive`);

            //运行命令
            exec(`mongodump -u=${options.user} -p=${options.pass} -d=${options.dbName} --archive="${path}" --authenticationDatabase admin`, (err) => {
                if (err) {
                    consola.error(err);
                }
                else {
                    consola.success("数据库备份成功！");
                }
            });
        },
        start: true
    });
});