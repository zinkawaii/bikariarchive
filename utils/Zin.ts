const Zin = new class Z {
    //默认动画配置
    DEFAULT_ANIME_OPTION = {
        duration: 400,
        easing: "ease",
        fill: "forwards"
    };

    //视口宽度常量
    WINDOW_SIZE_MAX = 1024;
    WINDOW_SIZE_MID = 768;
    WINDOW_SIZE_MIN = 425;

    //时间段常量
    PERIOD_DAY = Symbol();
    PERIOD_NIGHT = Symbol();

    //获取时间段
    get period() {
        const now = new Date();
        const hour = now.getHours();
        return (hour >= 6 && hour < 18) ? this.PERIOD_DAY : this.PERIOD_NIGHT;
    }

    //创建Fragment
    createFragment() {
        return document.createDocumentFragment();
    }

    //用虚拟DOM创建元素
    createNode(tag, attrs, ...children) {
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
    debounce<T extends () => any>(func: T, {
        delay = 1500,
        immediate = true
    } = {}) {
        let timer;
        return immediate ?
            function(...args: Parameters<T>) {
                timer ? clearTimeout(timer) : func.apply(this, args);
                timer = setTimeout(() => {
                    timer = null;
                }, delay);
            } :
            function(...args: Parameters<T>) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                    timer = null;
                }, delay);
            };
    }

    //从字符串或对象下载文本文件
    download(data, type, filename) {
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

    //立即运行并返回函数
    iife<T extends () => any>(func: T, ...args: Parameters<T>) {
        func.apply(this, args);
        return func;
    }

    //生成随机整数
    randInt(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    //延时执行函数
    setTimeout(duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, duration);
        });
    }

    //按照一定时间和次数循环执行函数
    setInterval(func: (time: number) => void, {
        duration = 1000,
        times = -1
    } = {}) {
        return new Promise<void>((resolve, reject) => {
            try {
                let t = 0;
                recursion();
                const { pause } = useIntervalFn(recursion, duration);

                function recursion() {
                    if (times >= 0 && t === times) {
                        pause();
                        resolve();
                    }
                    else {
                        func(t);
                        t++;
                    }
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }

    //节流
    throttle<T extends () => any>(func: T, delay: number) {
        //根据延迟时长
        if (delay && delay > 0) {
            let timer = null;
            return function(...args: Parameters<T>) {
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
            return function(...args: Parameters<T>) {
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
    timer(sign: string, func: () => any, times = 1) {
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