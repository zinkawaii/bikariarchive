export default {
    groups: [
        "AhrefsBot",
        "AhrefsSiteAudit",
        "aiHitBot",
        "BLEXBot",
        "Barkrowler",
        "CCBot",
        "DnyzBot",
        "DotBot",
        "ExtLinksBot",
        "GeedoBot",
        "GPTBot",
        "Mail.Ru",
        "MegaIndex.ru",
        "MixrankBot",
        "MJ12bot",
        "PetalBot",
        "Researchscan",
        "SemrushBot",
        "serpstatbot",
        "spbot",
        "Uptimebot",
        "ZoominfoBot"
    ].map((ua) => ({
        userAgent: ua,
        disallow: "/"
    }))
};