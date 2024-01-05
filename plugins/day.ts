import dayjs from "dayjs";
import zhCn from "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";

export default defineNuxtPlugin(() => {
    dayjs.locale(zhCn);
    dayjs.extend(relativeTime);
});