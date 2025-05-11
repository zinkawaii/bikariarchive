import { exec } from "node:child_process";
import consola from "consola";
import { Cron } from "croner";
import { format } from "date-fns";

export default defineNitroPlugin(() => {
    const config = useRuntimeConfig();
    const { options } = config.mongoose;

    const task = new Cron("0 33 23 * * 7", {
        timezone: "Asia/Shanghai",
    }, () => {
        //获取当前日期
        const date = new Date();

        //备份路径
        const path = r(`/server/backup/${format(date, "yyMMdd")}.archive`);

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
