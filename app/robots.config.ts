export default [
    ...[
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
        UserAgent: ua,
        Disallow: "/",
        BlankLine: true
    })),
    {
        Sitemap: (req) => `https://${req.headers.host}/sitemap.xml`
    }
];