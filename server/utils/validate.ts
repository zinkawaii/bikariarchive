export function validateIdentity(session: Session, identity: number) {
    if ((session.identity ?? 0) < identity) {
        throw createError({
            status: 403,
        });
    }
}

export function validateMyself(session: Session, uid: number) {
    if (session.uid !== uid && (session.identity ?? 0) < 9) {
        throw createError({
            status: 403,
        });
    }
}
