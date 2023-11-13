import md5 from "md5";

export default {
    //输入字符串（密码），生成返回哈希和盐值
    create(str: string) {
        const salt = md5(Date.now());
        let hash = md5(str) + salt;
        hash = md5(hash);
        return {
            hash,
            salt
        };
    },

    //输入字符串（密码）和盐值，返回哈希用于校验
    encrypt(str: string, salt: string) {
        let hash = md5(str) + salt;
        hash = md5(hash);
        return hash;
    }
};