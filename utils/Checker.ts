type CheckerEntries = Record<string, {
    target: Ref<string>,
    required?: boolean,
    reg: RegExp,
    message: string,
    validate?: (value: string) => string
}>;

export class Checker<T extends CheckerEntries> {
    entries: T;
    tips: Ref<Record<keyof T, string>>;

    constructor(entries: T) {
        this.entries = entries;

        this.tips = ref(Object.fromEntries(
            Object.keys(entries).map((key) => [key, ""])
        ) as any);
    }

    exec(key = "") {
        return (key in this.entries) ?
            this.simpleCheck(key) :
            Object.keys(this.entries).every((key) => this.simpleCheck(key));
    }

    clearTips() {
        for (const key in this.tips.value) {
            this.tips.value[key] = "";
        }
    }

    private simpleCheck(key: keyof T) {
        const { target, required, reg, message, validate } = this.entries[key];
        if (required || target.value) {
            const msg = !reg.test(target.value) ? message : validate?.(target.value);
            if (msg?.length > 0) {
                this.tips.value[key] = `* ${msg}`;
                return false;
            }
        }
        return true;
    }
}