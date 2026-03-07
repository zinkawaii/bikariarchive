//获取随机数
export function random(from: number, to: number) {
    return Math.random() * (to - from) + from;
}

//获取随机整数
export function randomInt(from: number, to: number) {
    return Math.floor(random(from, to));
}

//获取随机哈希
export function randomHash(length: number, radix = 16) {
    return Math.random().toString(radix).slice(-length);
}

//获取单个数组的随机项
export function randomItem<T>(arr: T[]) {
    const i = randomInt(0, arr.length);
    return arr[i];
}

//获取多个数组的同下标随机项
export function randomItems<T extends unknown[][]>(...arrs: T) {
    const length = Math.min(...arrs.map((arr) => arr.length));
    const i = randomInt(0, length);
    return arrs.map((arr) => arr[i]) as {
        [K in keyof T]: T[K][number];
    };
}
