interface DebounceOptions {
  delay?: number;
  immediate?: boolean;
  title?: string;
}

export const Zin = new class Z {
  // 视口宽度常量
  MAX_WINDOW_SIZE = 1024;
  MID_WINDOW_SIZE = 768;
  MIN_WINDOW_SIZE = 425;

  // 防抖（立即执行）
  debounce<T extends unknown[]>(func: (...args: T) => void, options: DebounceOptions = {}) {
    const {
      delay = 1500,
      immediate = true,
      title,
    } = options;

    const toastStore = useToastStore();
    let timer: NodeJS.Timeout | undefined;

    return immediate
      ? function(this: unknown, ...args: T) {
        timer ? clearAndToast() : func.apply(this, args);
        timer = setTimeout(() => {
          timer = void 0;
        }, delay);
      }
      : function(this: unknown, ...args: T) {
        timer && clearAndToast();
        timer = setTimeout(() => {
          func.apply(this, args);
          timer = void 0;
        }, delay);
      };

    function clearAndToast() {
      clearTimeout(timer);
      if (title !== void 0) {
        toastStore.info("[debounce]", `你的${title}速度太快了~`);
      }
    }
  }

  // 延时执行函数
  delay(duration: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  // 按照一定时间和次数循环执行函数
  interval(func: (time: number) => void, {
    immediate = true,
    server = true,
    duration = 1000,
    times = -1,
  } = {}) {
    return new Promise<void>((resolve) => {
      let t = 0;
      const { pause } = useIntervalFn(recursion, duration);

      immediate && (
        server ? recursion() : tryOnMounted(recursion)
      );

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
    });
  }

  // 节流
  throttle<T extends unknown[]>(func: (...args: T) => void, delay?: number) {
    // 根据延迟时长
    if (delay && delay > 0) {
      let timer: NodeJS.Timeout | undefined;
      return function(this: unknown, ...args: T) {
        if (!timer) {
          func.apply(this, args);
          timer = setTimeout(() => {
            timer = void 0;
          }, delay);
        }
      };
    }
    // 根据屏幕刷新率
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
