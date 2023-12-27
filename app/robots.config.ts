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
        "GeedoBot",
        "GPTBot",
        "Mail.Ru",
        "MegaIndex.ru",
        "MixrankBot",
        "MJ12bot",
        "PetalBot",
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