export default defineWrappedHandler(async (event) => {
    clearH3EventContextSession(event);
});