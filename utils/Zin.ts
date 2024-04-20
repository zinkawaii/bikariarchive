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

    //防抖（立即执行）
    debounce<T extends unknown[]>(func: (...args: T) => void, {
        delay = 1500,
        immediate = true,
        title = null
    } = {}) {
        const toastStore = useToastStore();
        let timer;
        return <(this: unknown, ...args: T) => void> (
            immediate
            ? function(...args) {
                timer ? clearAndToast() : func.apply(this, args);
                timer = setTimeout(() => {
                    timer = null;
                }, delay);
            }
            : function(...args) {
                timer && clearAndToast();
                timer = setTimeout(() => {
                    func.apply(this, args);
                    timer = null;
                }, delay);
            }
        );

        function clearAndToast() {
            clearTimeout(timer);
            title && toastStore.info("debounce", `你的${title}速度太快了~`);
        }
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

    //生成随机整数
    randInt(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    //延时执行函数
    setTimeout(duration: number) {
        return new Promise<void>((resolve) => {
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
                const { pause } = useIntervalFn(recursion, duration, {
                    immediateCallback: true
                });

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
    throttle<T extends unknown[]>(func: (...args: T) => void, delay?: number) {
        //根据延迟时长
        if (delay && delay > 0) {
            let timer = null;
            return function(this: unknown, ...args: T) {
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
            return function(this: unknown, ...args: T) {
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
}();

export default Zin;