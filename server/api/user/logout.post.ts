export default defineJEventHandler(async (event) => {
  const session = await readSession(event);
  await session.clear();
});
