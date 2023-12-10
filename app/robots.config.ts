export default {
    groups: [
        "AhrefsBot",
        "AhrefsSiteAudit",
        "aiHitBot",
        "BLEXBot",
        "Barkrowler",
        "DnyzBot",
        "DotBot",
        "ExtLinksBot",
        "GPTBot",
        "Mail.Ru",
        "MegaIndex.ru",
        "MJ12bot",
        "Researchscan",
        "SemrushBot",
        "spbot",
        "Uptimebot",
        "ZoominfoBot"
    ].map((ua) => ({
        userAgent: ua,
        disallow: "/"
    }))
};