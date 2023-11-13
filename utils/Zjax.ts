type ZjaxOptions = Partial<{
    url: string,
    method: string,
    data: any,
    timeout: number
}>;

const Zjax = function({
    url,
    method,
    data,
    timeout
}: ZjaxOptions) {
    return Zjax[method]?.({ url, data, timeout });
};

Zjax.get = request("get");
Zjax.post = request("post");
Zjax.put = request("put");
Zjax.delete = request("delete");

function request(method: string) {
    return async function({
        url: urlStr,
        data = {},
        timeout = 0
    }) {
        const url = new URL(urlStr, location.origin);
        const options: RequestInit = { method };

        //数据处理
        ({ get, post }[method.toLowerCase()] || post)(url, data, options);

        //超时处理
        if (timeout > 0) {
            const controller = new AbortController();
            options.signal = controller.signal;
            setTimeout(() => controller.abort(), timeout);
        }

        const res = await fetch(url, options);
        if (res.status >= 400) {
            throw new Error(`The server responded with a status of ${res.status} ()`);
        }
        return res.json();
    };
}

function get(url: URL, data: any, options: RequestInit) {
    for (const key in data) {
        url.searchParams.append(key, data[key]);
    }
}

function post(url: URL, data: any, options: RequestInit) {
    options.headers = {
        "Content-Type": "application/json"
    };
    options.body = JSON.stringify(data);
}

export default Zjax;