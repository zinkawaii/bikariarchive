const Zin = new class Z
{
    //默认动画配置
    DEFAULT_ANIME_OPTION = {
        duration: 400,
        easing: "ease",
        fill: "forwards"
    };

    //视口宽度常量
    MOBILE_SIZE_MAX = 1024;
    MOBILE_SIZE_MID = 768;
    MOBILE_SIZE_MIN = 425;

    //时间段常量
    PERIOD_DAY = Symbol();
    PERIOD_NIGHT = Symbol();

    //获取时间段
    get period()
    {
        const now = new Date();
        const hour = now.getHours();
        return (hour >= 6 && hour < 18) ? this.PERIOD_DAY : this.PERIOD_NIGHT;
    }

    //创建Fragment
    createFragment()
    {
        return document.createDocumentFragment();
    }

    //用虚拟DOM创建元素
    createNode(tag, attrs, ...children)
    {
        //初始化
        const node = {
            function: () => tag(),
            string: () => document.createElement(tag, {
                is: attrs?.is
            })
        }[typeof tag]?.() || tag;

        //属性
        for (const key in attrs) {
            const val = attrs[key];
            if (key.startsWith("on")) {
                node[key] = val;
            }
            else if (val !== false && val !== null && val !== void(0)) {
                node.setAttribute(key, val);
            }
        }

        //子元素
        children.forEach((child) => {
            if (typeof child === "object") {
                node.appendChild(child);
            }
            else {
                node.appendChild(new Text(child));
            }
        });

        return node;
    }

    //防抖（立即执行）
    debounce(func, {
        delay = 1500,
        immediate = true
    } = {}) {
        let timer;
        return immediate ?
            function(...args) {
                timer ? clearTimeout(timer) : func.apply(this, args);
                timer = setTimeout(() => {
                    timer = null;
                }, delay);
            } :
            function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                    timer = null;
                }, delay);
            };
    }

    //从字符串或对象下载文本文件
    download(data, type, filename)
    {
        let blob;
        if (type === "blob") {
            blob = new Blob([data], {
                type: "text/plain;charset=utf-8"
            });
        }
        else if (type === "json") {
            blob = new Blob([JSON.stringify(data)], {
                type: "application/json"
            });
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    //获取元素绝对位置
    getPosition(e)
    {
        let top = 0;
        let left = 0;
        let current = e;

        do {
            top += current.offsetTop;
            left += current.offsetLeft;
            current = current.offsetParent;
        } while (current !== null);

        return {
            top,
            left
        };
    }

    //立即运行并返回函数
    iife(func, ...args)
    {
        func.apply(this, args);
        return func;
    }

    //生成随机整数
    randInt(from, to)
    {
        return parseInt(Math.random() * (to - from + 1) + from);
    }

    //延时执行函数
    setTimeout(duration)
    {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, duration);
        });
    }

    //按照一定时间和次数循环执行函数
    setInterval(func, {
        duration = 1000,
        times = -1
    }) {
        return new Promise<void>((resolve, reject) => {
            let t = 0;
            recursion();

            function recursion() {
                try {
                    func(t);
                    setTimeout(() => {
                        t++;
                        if (times >= 0 && t === times) {
                            resolve();
                            return;
                        }
                        recursion();
                    }, duration);
                }
                catch (err) {
                    reject(err);
                }
            }
        });
    }

    //节流
    throttle(func, delay)
    {
        //根据延迟时长
        if (delay && delay > 0) {
            let timer = null;
            return function(...args) {
                if (!timer) {
                    func.apply(this, args);
                    timer = setTimeout(() => {
                        timer = null;
                    }, delay);
                }
            };
        }
        //根据屏幕刷新率
        else {
            let running = false;
            return function(...args) {
                if (!running) {
                    running = true;
                    requestAnimationFrame(() => {
                        func.apply(this, args);
                        running = false;
                    });
                }
            };
        }
    }

    //性能计时
    timer(sign, func, times = 1)
    {
        //开始标记
        performance.mark("start");

        //运行函数
        for (let i = 0; i < times; i++) {
            func();
        }

        //结束标记
        performance.mark("end");

        //计算时长
        const measure = performance.measure("full", "start", "end");
        console.info(`${sign} -- ${measure.duration.toFixed(0)}ms`);
    }
};

export default Zin;