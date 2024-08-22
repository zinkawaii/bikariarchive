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
            name: "chanrina",
            path: "/chanrina",
            component: () => import("~/pages/chanrina.vue"),
            meta: {
                identity: 6,
                middleware: ["auth"]
            }
        },
        {
            name: "chest",
            path: "/chest",
            component: () => import("~/pages/chest.vue")
        },
        {
            name: "compact",
            path: "/compact",
            component: () => import("~/pages/compact.vue")
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
            name: "reader",
            path: "/book/:novel/:index",
            props: true,
            component: () => import("~/pages/reader.vue"),
            meta: {
                comment: true,
                breadcrumb: {
                    name: "shelf"
                }
            }
        },
        {
            name: "search",
            path: "/search",
            component: () => import("~/pages/search.vue")
        },
        {
            name: "shelf",
            path: "/shelf",
            component: () => import("~/pages/shelf.vue")
        },
        {
            name: "tweet",
            path: "/tweet",
            component: () => import("~/pages/tweet.vue"),
            meta: {
                comment: true
            }
        },
        {
            name: "update",
            path: "/update",
            component: () => import("~/pages/update.vue")
        },
        {
            name: "entry",
            path: "/:title",
            props: true,
            component: () => import("~/pages/entry.vue"),
            meta: {
                comment: true,
                breadcrumb: {
                    name: "details"
                }
            }
        },
        {
            name: "excalc",
            path: "/tools/excalc",
            component: () => import("~/pages/tools/excalc.vue")
        },
        {
            name: "lyricaxis",
            path: "/tools/lyricaxis",
            component: () => import("~/pages/tools/lyricaxis.vue")
        },
        {
            name: "namaemaker",
            path: "/tools/namaemaker",
            component: () => import("~/pages/tools/namaemaker.vue")
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
            ],
            meta: {
                sidebar: false
            }
        },
        {
            name: "unknown",
            path: "/:pathMatch(.*)*",
            component: () => import("~/pages/unknown.vue")
        }
    ]
};