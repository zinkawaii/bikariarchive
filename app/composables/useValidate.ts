interface ValidateEntry {
    target: Ref<string>;
    required?: boolean;
    rule?: RegExp;
    message?: string;
    exec?: (value: string) => string | void;
}

export default function<T extends Record<string, ValidateEntry>>(entries: T) {
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
            const msg = rule && !rule.test(target.value) ? message : exec?.(target.value);

            if (msg?.length) {
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

export const nicknameValidates: Partial<ValidateEntry> = {
    rule: /^[\w\u4E00-\u9FA5]*$/,
    message: "昵称不可包含非法字符",
    exec(value) {
        const count = getByteLength(value);
        if (count === 0) {
            return "昵称不能为空";
        }
        else if (count > 24) {
            return "昵称长度不能超过 24 个字符";
        }
    }
};

export const passwordValidates: Partial<ValidateEntry> = {
    rule: /^\w*$/,
    message: "密码仅由大小写字母、数字以及下划线组成",
    exec(value) {
        const count = getByteLength(value);
        if (count < 6 || count > 18) {
            return "密码位数必须在 6-18 位之间";
        }
    }
};