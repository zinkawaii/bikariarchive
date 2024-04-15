export default defineCustomHandler(async (event) => {
    clearH3EventContextSession(event);
});