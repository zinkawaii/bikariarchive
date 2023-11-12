import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig> {
    routes: (_routes) => [
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
            name: "details",
            path: "/details",
            component: () => import("~/pages/details.vue")
        },
        {
            name: "friend",
            path: "/friend",
            component: () => import("~/pages/friend.vue")
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
            component: () => import("~/pages/reader.vue")
        },
        {
            name: "search",
            path: "/search",
            component: () => import("~/pages/search.vue")
        },
        {
            name: "entry",
            path: "/:title",
            component: () => import("~/pages/entry/index.vue")
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
            redirect: { name: "login" },
            component: () => import("~/pages/user/index.vue"),
            children: [
                {
                    name: "login",
                    path: "login",
                    component: () => import("~/pages/user/login.vue")
                },
                {
                    name: "logon",
                    path: "logon",
                    component: () => import("~/pages/user/logon.vue")
                },
                {
                    name: "space",
                    path: "space/:uid",
                    component: () => import("~/pages/user/space.vue")
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