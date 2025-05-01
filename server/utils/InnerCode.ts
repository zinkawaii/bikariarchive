import CryptoES from "crypto-es";

const { MD5 } = CryptoES;

export const InnerCode = {
    //输入字符串（密码），生成返回哈希和盐值
    create(str: string) {
        const salt = MD5(Date.now().toString()).toString();
        const hash = MD5(MD5(str) + salt).toString();
        return {
            hash,
            salt,
        };
    },

    //输入字符串（密码）和盐值，返回哈希用于校验
    encrypt(str: string, salt: string) {
        const hash = MD5(MD5(str) + salt).toString();
        return hash;
    },
};
