import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig> {
    routes: () => [
        {
            name: "about",
            path: "/about",
            component: () => import("~/pages/about.vue"),
            meta: {
                fullPage: true,
            },
        },
        {
            path: "/book",
            redirect: { name: "unknown" },
            component: () => import("~/pages/book/index.vue"),
            children: [
                {
                    name: "shelf",
                    path: ":novel.:volume",
                    component: () => import("~/pages/book/shelf.vue"),
                    meta: {
                        scrollToTop(to, from) {
                            if (to.params.novel === from.params.novel) {
                                return false;
                            }
                        },
                    },
                },
            ],
        },
        {
            name: "article",
            path: "/book/:novel/:index",
            props: true,
            component: () => import("~/pages/book/article.vue"),
            meta: {
                catalog: true,
                comment: true,
            },
        },
        {
            name: "bangumi",
            path: "/bangumi",
            component: () => import("~/pages/bangumi.vue"),
            meta: {
                widePage: true,
            },
        },
        {
            name: "borrowing",
            path: "/borrowing",
            component: () => import("~/pages/borrowing.vue"),
        },
        {
            name: "chest",
            path: "/chest",
            component: () => import("~/pages/chest.vue"),
        },
        {
            name: "compact",
            path: "/compact",
            component: () => import("~/pages/compact.vue"),
        },
        {
            name: "friend",
            path: "/friend",
            component: () => import("~/pages/friend.vue"),
            meta: {
                comment: true,
            },
        },
        {
            name: "home",
            path: "/home",
            alias: "/",
            component: () => import("~/pages/home.vue"),
            meta: {
                jumbotron: true,
            },
        },
        {
            name: "intel",
            path: "/intel",
            component: () => import("~/pages/intel.vue"),
        },
        {
            name: "search",
            path: "/search",
            component: () => import("~/pages/search.vue"),
        },
        {
            name: "tweet",
            path: "/tweet",
            component: () => import("~/pages/tweet.vue"),
            meta: {
                comment: true,
            },
        },
        {
            path: "/update",
            redirect: { name: "unknown" },
            component: () => import("~/pages/update/index.vue"),
            children: [
                {
                    name: "update",
                    path: ":year",
                    component: () => import("~/pages/update/year.vue"),
                },
            ],
        },
        {
            name: "entry",
            path: "/:title",
            props: true,
            component: () => import("~/pages/entry.vue"),
            meta: {
                catalog: true,
                comment: true,
            },
        },
        {
            name: "lyricaxis",
            path: "/tools/lyricaxis",
            component: () => import("~/pages/tools/lyricaxis.vue"),
        },
        {
            name: "namaemaker",
            path: "/tools/namaemaker",
            component: () => import("~/pages/tools/namaemaker.vue"),
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
                        middleware: ["auth"],
                    },
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
                            component: () => import("~/pages/user/manage/read-record.vue"),
                        },
                        {
                            name: "user-data",
                            path: "user-data",
                            component: () => import("~/pages/user/manage/user-data.vue"),
                        },
                    ],
                    meta: {
                        identity: 9,
                        middleware: ["auth"],
                    },
                },
            ],
            meta: {
                sidebar: false,
            },
        },
        {
            name: "unknown",
            path: "/:pathMatch(.*)*",
            component: () => import("~/pages/unknown.vue"),
        },
    ],
};
