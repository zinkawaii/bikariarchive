import lunisolar from "lunisolar";
import zhCn from "lunisolar/locale/zh-cn";

export default defineNuxtPlugin(() => {
    lunisolar.locale(zhCn);
});
