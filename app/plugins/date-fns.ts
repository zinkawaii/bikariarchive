import { setDefaultOptions } from "date-fns";
import { zhCN } from "date-fns/locale";

export default defineNuxtPlugin(() => {
    setDefaultOptions({
        locale: zhCN,
    });
});
