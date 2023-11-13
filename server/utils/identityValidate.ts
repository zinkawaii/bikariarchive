export function identityValidate(event, identity: number) {
    const { session } = event.context;

    if ((session.identity || 0) < identity) {
        throw {
            statusCode: 403
        };
    }
}