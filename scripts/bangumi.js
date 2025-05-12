import { readFile, writeFile } from "node:fs/promises";
import defu from "defu";

//读取文件
const path = "../data/json/Bangumi.json";
const file = await readFile(path, "utf-8");
const data = JSON.parse(file);

//ID列表
const list = [];

for (const id of list) {
    let item = {};
    if (typeof id === "number") {
        item.id = id;
    }
    else if (Array.isArray(id)) {
        //提供强制覆盖值
        item = defu(id[1], { id: id[0] });
    }

    //词条已存在
    if (data.find(({ id }) => item.id === id)) {
        continue;
    }

    //发送请求
    const res = await fetch(`https://api.bgm.tv/v0/subjects/${item.id}`);
    const json = await res.json();

    //深度合并
    item = defu(item, {
        id: json.id,
        title: {
            jp: json.name,
            zh: json.name_cn || json.name,
        },
        cover: json.images.common,
        date: json.date,
    });

    data.push(item);
    console.log(item.title.zh, item.date);
}

//按照日期和ID排序
data.sort((a, b) => {
    return b.date.localeCompare(a.date) || a.id > b.id;
});

//写入文件
await writeFile(path, JSON.stringify(data, null, 2));
