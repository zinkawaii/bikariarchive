import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export default defineNitroPlugin((app) => {
    dayjs.extend(tz);
    dayjs.extend(utc);
    dayjs.tz.setDefault("Asia/ShangHai");
});