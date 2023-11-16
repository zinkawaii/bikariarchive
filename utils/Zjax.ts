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
    return Zjax[method]?.(url, { data, timeout });
};

Zjax.get = request("get");
Zjax.post = request("post");
Zjax.put = request("put");
Zjax.delete = request("delete");

function request(method: string) {
    return async function(urlStr: string, {
        body = {},
        query = {},
        timeout = 0
    } = {}) {
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

        const res = await fetch(url, options);
        if (res.status >= 400) {
            throw new Error(`The server responded with a status of ${res.status} ()`);
        }
        return res.json();
    };
}

export default Zjax;