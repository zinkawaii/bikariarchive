import { type, type Type } from "arktype";

interface ValidateEntry extends ValidatePreset {
    target: Ref<string>;
    required?: boolean;
    preset?: keyof typeof presets;
}

interface ValidatePreset {
    rule?: Type;
    message?: string;
    exec?: (input: string) => string | void;
}

export function useValidate<T extends Record<string, ValidateEntry>>(entries: T) {
    const toastStore = useToastStore();

    for (const key in entries) {
        if (entries[key].preset !== void 0) {
            // eslint-disable-next-line ts/no-use-before-define
            Object.assign(entries[key], presets[entries[key].preset]);
        }
    }

    const errors = ref(
        Object.fromEntries(Object.keys(entries).map((key) => [key, false])) as Record<keyof T, boolean>,
    );

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
            const msg = exec?.(target.value) ?? (
                rule?.(target.value) instanceof type.errors ? message : void 0
            );

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
        validate,
    };
}

const presets = {
    nickname: {
        exec(input) {
            if (input.length === 0) {
                return "昵称不能为空";
            }
            else if (input.length > 18) {
                return "昵称长度不能超过 18 个字符";
            }
        },
    },
    password: {
        exec(input) {
            if (input.length < 12 || input.length > 24) {
                return "密码位数必须在 12-24 位之间";
            }
        },
    },
    email: {
        rule: type("string.email"),
        message: "邮箱格式不正确",
    },
    url: {
        rule: type("string.url"),
        message: "网址格式不正确",
    },
    captcha: {
        exec(input) {
            if (input.length !== 6) {
                return "验证码长度必须为 6 位";
            }
        },
    },
} satisfies Record<string, ValidatePreset>;
