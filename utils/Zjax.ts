type ZjaxOptions = Partial<{
    url: string,
    method: string,
    data: any,
    timeout: number
}>;

const zjax = function({
    url,
    method,
    data,
    timeout
}: ZjaxOptions) {
    return zjax[method]?.({ url, data, timeout });
};

for (const method of ["get", "post", "put", "delete"]) {
    Object.defineProperty(zjax, method, {
        value: request(method)
    });
}

function request(method: string)
{
    return async function({
        url: urlStr,
        data,
        timeout
    }) {
        const url = new URL(urlStr, location.origin);
        const options: RequestInit = { method };

        //数据处理
        ({ get, post }[method.toLowerCase()] || post)(url, data, options);

        //超时处理
        if (timeout >= 0) {
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

function get(url: URL, data: any, options: RequestInit)
{
    for (const key in data) {
        url.searchParams.append(key, data[key]);
    }
}

function post(url: URL, data: any, options: RequestInit)
{
    options.headers = {
        "Content-Type": "application/json"
    };
    options.body = JSON.stringify(data);
}

export default zjax;