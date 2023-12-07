const config = useRuntimeConfig();
const { blacklist } = config;
const domain = ["localhost", config.public.domain];

//IP遍历检测
const checkIP = function(ip: string, list: string[]) {
    for (const item of list) {
        const reg = new RegExp(`^${item.replace(/\*/g, "\\d{1,3}")}$`);
        if (reg.test(ip)) {
            return true;
        }
    }
    return false;
};

//User-Agent正则对象
const re_ua = (blacklist.ua.length > 0) ?
    new RegExp(blacklist.ua.map((item) => `(${item})`).join("|"), "gi") :
    /[^\s\S]/g;

export default defineEventHandler(async (event) => {
    const { req, res } = event.node;
    const { hostname } = getRequestURL(event);
    const ip = getRequestIP(event, { xForwardedFor: true });

    //禁止通过非限定域名访问
    if (!domain.includes(hostname)) {
        res.writeHead(404).end();
    }
    //恶意IP拦截
    else if (checkIP(ip, blacklist.ip)) {
        res.writeHead(403).end();
    }
    //User-Agent拦截
    else if (req.headers["user-agent"].match(re_ua)) {
        res.writeHead(403).end();
    }
});