interface ZjaxOptions {
    body?: any;
    query?: any;
    timeout?: number;
}

//创建请求
const createRequest = (method: string) => (url: string, options?: ZjaxOptions) => request(method, url, options);

export default function Zjax(options: {
    url: string;
    method: string;
} & ZjaxOptions) {
    return request(options.method, options.url, options);
}

Zjax.get = createRequest("get");
Zjax.post = createRequest("post");
Zjax.put = createRequest("put");
Zjax.delete = createRequest("delete");

//请求函数体
async function request(method: string, urlStr: string, {
    body = {},
    query = {},
    timeout = 0
}: ZjaxOptions = {}) {
    const url = new URL(urlStr, location.origin);
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    //数据处理
    for (const key in query) {
        url.searchParams.append(key, query[key]);
    }

    if (Object.keys(body).length > 0) {
        options.body = JSON.stringify(body);
    }

    //超时处理
    if (timeout > 0) {
        const controller = new AbortController();
        options.signal = controller.signal;
        setTimeout(() => controller.abort(), timeout);
    }

    //发送请求
    const res = await fetch(url, options);
    if (res.status >= 400) {
        throw new Error(`The server responded with a status of ${res.status} ()`);
    }
    return res.json();
}