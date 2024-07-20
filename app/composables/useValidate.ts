type ValidatorEntries = Record<string, {
    target: Ref<string>;
    required?: boolean;
    rule: RegExp;
    message: string;
    exec?: (value: string) => string;
}>;

export default function<T extends ValidatorEntries>(entries: T) {
    const toastStore = useToastStore();

    const errors: Ref<Record<keyof T, boolean>> = ref(Object.fromEntries(
        Object.keys(entries).map((key) => [key, false])
    ) as any);

    //清除错误
    function clear() {
        for (const key in errors.value) {
            errors.value[key] = false;
        }
    }

    //错误提示
    function glitch(key: keyof T, message: string) {
        toastStore.error(`[${key as string}]:validate`, message);
        errors.value[key] = true;
    }

    //全字段验证
    function validate(key: keyof T = "") {
        return key ? check(key) : Object.keys(entries).every((key) => check(key));
    }

    //单字段验证
    function check(key: keyof T) {
        const { target, required, rule, message, exec } = entries[key];

        if (required || target.value) {
            const msg = !rule.test(target.value) ? message : exec?.(target.value);

            if (msg?.length > 0) {
                glitch(key, msg);
                return false;
            }
        }
        return true;
    }

    return {
        errors,
        clear,
        glitch,
        validate
    };
}