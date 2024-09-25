import consola from "consola";

//是否为开发环境
export const isDev = process.env.NODE_ENV === "development";

//统计执行时长
export function timer<T extends unknown[]>(sign: string, func: (...args: T) => void) {
    return async function(this: unknown, ...args: T) {
        const start = `${sign}:start`;
        const end = `${sign}:end`;
        const full = `${sign}:full`;

        //开始标记
        performance.mark(start);

        //运行函数
        const output = await func.call(this, ...args) ?? true;

        //结束标记
        performance.mark(end);

        //计算时长
        const measure = performance.measure(full, start, end);
        output && consola.success(`${sign} -- ${measure.duration.toFixed(0)}ms`);
    };
}