export default defineCustomHandler(async (event) => {
    const res: BaseResponse = { error: 0 };

    clearH3EventContextSession(event);
    return res;
});