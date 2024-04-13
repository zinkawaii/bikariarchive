import SftpClient from "ssh2-sftp-client";
import consola from "consola";
import fs from "fs-extra";
import prompts from "prompts";
import * as tar from "tar";
import { timer } from "@bikari/shared";

const options = await prompts([
    {
        type: "confirm",
        name: "compress",
        message: "是否压缩构建包？",
        initial: false
    },
    {
        type: "confirm",
        name: "send",
        message: "是否上传构建包？",
        initial: false
    }
]);

const packname = "bikari.tgz";
const root = "<!-- ??? -->";

options.compress &&
await timer("压缩构建包", async () => {
    await tar.create({
        gzip: true,
        file: packname,
        cwd: "../"
    }, [".output", "dist"]);
})();

const sftp = new SftpClient();
const client = sftp.client;

await timer("连接服务器", async () => {
    await sftp.connect({
        host: "<!-- ??? -->",
        port: 1177,
        username: "<!-- ??? -->",
        password: "<!-- ??? -->"
    });
})();

options.send &&
await timer("上传构建包", async () => {
    await sftp.put(`./${packname}`, `${root}/${packname}`);
})();

client.exec(`
    cd ${root};
    git pull --rebase;
    sudo rm -rf {.output,dist};
    sudo tar -xzvf ${packname};
    sudo pnpm i;
    pnpm run deploy;
`, (err, channel) => {
    if (err) {
        throw err;
    }
    channel.on("data", (data) => {
        console.info(data.toString().trim());
    });
});