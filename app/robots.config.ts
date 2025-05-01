import type { ModuleOptions } from "@nuxtjs/robots";

export default <ModuleOptions> {
    credits: false,
    groups: [
        "AhrefsBot",
        "AhrefsSiteAudit",
        "Amazonbot",
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
        "ZoominfoBot",
    ].map((ua) => ({
        userAgent: ua,
        disallow: "/",
    })),
};
