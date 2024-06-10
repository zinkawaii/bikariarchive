export default function(name: string, defaultValue?: string) {
    const route = useRoute();
    const router = useRouter();

    const query = computed({
        get() {
            return route.query[name]?.toString() ?? defaultValue;
        },
        set(val) {
            const query = route.query;
            router.replace({
                query: {
                    ...query,
                    [name]: val
                }
            });
        }
    });

    return query;
}