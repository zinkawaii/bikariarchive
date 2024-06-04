export default function<P extends Record<string, string | string[]>>() {
    const route = useRoute();

    return computed(() => {
        return route.params as P;
    });
}