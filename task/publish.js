import cp from "child_process";
import dayjs from "dayjs";

const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

exec("git init");
exec("git config core.autocrlf false");
exec("git config core.savecrlf false");
exec(`git branch -m deploy`);
exec("git add -A");
exec(`git commit -m "Updated: ${now}"`);
exec(`git remote add origin/deploy git@github.com:MysteryBao37/BikariArchive-Nuxt.git`);
exec(`git push --set-upstream origin/deploy deploy`);

function exec(command) {
    try {
        const res = cp.execSync(command, {
            cwd: "../.output"
        });

        if (res.length > 0) {
            console.log(res.toString());
        }
    }
    catch (err) {
        console.error(err.stderr?.toString());
    }
}