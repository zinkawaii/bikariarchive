export default function(event: any) {
    const query = getQuery(event);
    const obj: {
        [T in any]: string | undefined
    } = {};

    for (const key in query) {
        obj[key] = query[key]?.toString();
    }
    return obj;
}