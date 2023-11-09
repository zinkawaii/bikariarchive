import type { RouterConfig } from "@nuxt/schema";
import Unknown from "~/pages/unknown.vue";

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
            name: "unknown",
            path: "/:pathMatch(.*)*",
            component: Unknown
        },
        {
            name: "tools",
            path: "/tools",
            redirect: "/unknown",
            component: () => import("~/pages/tools/tools.vue"),
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
        }
    ]
};