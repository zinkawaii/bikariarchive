import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig> {
    routes: () => [
        {
            name: "about",
            path: "/about",
            component: () => import("~/pages/about.vue"),
            meta: {
                fullPage: true
            }
        },
        {
            name: "bangumi",
            path: "/bangumi",
            component: () => import("~/pages/bangumi.vue"),
            meta: {
                widePage: true
            }
        },
        {
            name: "borrowing",
            path: "/borrowing",
            component: () => import("~/pages/borrowing.vue")
        },
        {
            name: "catalogue",
            path: "/catalogue",
            component: () => import("~/pages/catalogue.vue")
        },
        {
            name: "chanrina",
            path: "/chanrina",
            component: () => import("~/pages/chanrina.vue"),
            meta: {
                identity: 6,
                middleware: ["auth"]
            }
        },
        {
            name: "details",
            path: "/details",
            component: () => import("~/pages/details.vue")
        },
        {
            name: "friend",
            path: "/friend",
            component: () => import("~/pages/friend.vue"),
            meta: {
                comment: true
            }
        },
        {
            name: "home",
            path: "/home",
            alias: "/",
            component: () => import("~/pages/home.vue")
        },
        {
            name: "compact",
            path: "/compact",
            component: () => import("~/pages/compact.vue")
        },
        {
            name: "reader",
            path: "/book/:novel/:index",
            component: () => import("~/pages/reader.vue"),
            meta: {
                comment: true,
                breadcrumb: {
                    name: "catalogue"
                }
            }
        },
        {
            name: "search",
            path: "/search",
            component: () => import("~/pages/search.vue")
        },
        {
            name: "update",
            path: "/update",
            component: () => import("~/pages/update.vue")
        },
        {
            name: "entry",
            path: "/:title",
            component: () => import("~/pages/entry.vue"),
            meta: {
                comment: true,
                breadcrumb: {
                    name: "details"
                }
            }
        },
        {
            name: "tools",
            path: "/tools",
            redirect: { name: "unknown" },
            component: () => import("~/pages/tools/index.vue"),
            children: [
                {
                    name: "excalc",
                    path: "excalc",
                    component: () => import("~/pages/tools/excalc.vue")
                },
                {
                    name: "lyricaxis",
                    path: "lyricaxis",
                    component: () => import("~/pages/tools/lyricaxis.vue")
                },
                {
                    name: "namaemaker",
                    path: "namaemaker",
                    component: () => import("~/pages/tools/namaemaker.vue")
                }
            ]
        },
        {
            name: "user",
            path: "/user",
            redirect: { name: "unknown" },
            component: () => import("~/pages/user/index.vue"),
            children: [
                {
                    name: "space",
                    path: "space/:uid",
                    component: () => import("~/pages/user/space.vue"),
                    meta: {
                        identity: 1,
                        middleware: ["auth"]
                    }
                },
                {
                    name: "manage",
                    path: "manage",
                    redirect: { name: "read-record" },
                    component: () => import("~/pages/user/manage/index.vue"),
                    children: [
                        {
                            name: "read-record",
                            path: "read-record",
                            component: () => import("~/pages/user/manage/read-record.vue")
                        },
                        {
                            name: "user-data",
                            path: "user-data",
                            component: () => import("~/pages/user/manage/user-data.vue")
                        }
                    ],
                    meta: {
                        identity: 9,
                        middleware: ["auth"]
                    }
                }
            ]
        },
        {
            name: "unknown",
            path: "/:pathMatch(.*)*",
            component: () => import("~/pages/unknown.vue")
        }
    ]
};