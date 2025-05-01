import defu from "defu";
import fs from "fs-extra";

//读取文件
const path = "../data/json/Bangumi.json";
const file = await fs.readJson(path);

//ID列表
const list = [];

for (const item of list) {
    let data = {};
    if (typeof item === "number") {
        data.id = item;
    }
    else if (Array.isArray(item)) {
        //提供强制覆盖值
        data = defu(item[1], { id: item[0] });
    }

    //词条已存在
    if (file.findIndex((item) => {
        return item.id === data.id;
    }) !== -1) continue;

    //发送请求
    const res = await fetch(`https://api.bgm.tv/v0/subjects/${data.id}`);
    const json = await res.json();

    //深度合并
    data = defu(data, {
        id: json.id,
        title: {
            jp: json.name,
            zh: json.name_cn || json.name,
        },
        cover: json.images.common,
        date: json.date,
    });

    file.push(data);
    console.log(data.title.zh, data.date);
}

//按照日期和ID排序
file.sort((a, b) => {
    return b.date.localeCompare(a.date) || a.id > b.id;
});

//写入文件
fs.writeJson(path, file, {
    spaces: 2,
});
