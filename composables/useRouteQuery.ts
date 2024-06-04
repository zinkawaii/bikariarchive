export default function(name: string) {
    const route = useRoute();
    const router = useRouter();

    const query = computed({
        get() {
            return route.query[name]?.toString() ?? "";
        },
        set(val) {
            router.replace({ query: { [name]: val } });
        }
    });

    return query;
}