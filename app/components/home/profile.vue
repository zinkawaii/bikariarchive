<script lang="ts" setup>
    const contextMenuStore = useContextMenuStore();
    const router = useRouter();

    const links = [
        {
            title: "GitHub",
            to: "https://github.com/KazariEX",
            icon: "fa7-brands:github",
        },
        {
            title: "Twitter",
            to: "https://twitter.com/KazariEX_0929",
            icon: "fa7-brands:twitter",
        },
        {
            title: "BiliBili",
            to: "https://space.bilibili.com/37810541",
            icon: "fa7-brands:bilibili",
        },
        {
            title: "QQ",
            to: "https://jq.qq.com/?_wv=1027&k=ezy4Y5TS",
            icon: "fa7-brands:qq",
        },
        {
            title: "RSS",
            to: "/feed",
            icon: "fa7-solid:rss",
        },
    ];

    const avatarEl = useTemplateRef("avatar");
    contextMenuStore.extra(avatarEl, {
        title: "profile",
        shield: ["image"],
        items: [
            {
                title: "说说",
                icon: "bi:chat-dots-fill",
                action() {
                    router.push({ name: "tweet" });
                },
            },
        ],
    });
</script>

<template>
    <div class="home-profile content-table">
        <profile-backdrop light="10%" dark="54%"/>
        <hgroup class="profile-header">
            <img ref="avatar" class="profile-avatar" :src="$config.public.avatar" alt="[avatar]"/>
            <h3 class="profile-author">{{ $config.public.author }}</h3>
            <p class="profile-phrase">{{ $config.public.phrase }}</p>
            <nav class="profile-links">
                <nuxt-link
                    v-for="{ title, icon, to } in links"
                    class="profile-link"
                    :to
                    target="_blank"
                    :aria-label="title"
                >
                    <iconify :name="icon"/>
                </nuxt-link>
            </nav>
        </hgroup>
        <span class="profile-irregular">Story<br />Irregular</span>
        <div class="profile-confession">
            <p>あなただけのために存在する<ruby>世界<rt>イレギュラー</rt></ruby>、<br />それが物語。</p>
            <p>筆を執ることは、一生をかけて、<br />言葉で自らを癒すこと。</p>
            <p>努力が報いられるということ自体、<br />誰かにとっての得がたい幸運。</p>
            <p>頑張ると幸せになる世界、<br />つらいことをしなくてもいい世界、<br />やがて夢が叶う世界、</p>
            <p>僕は書きたいんだ。</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .home-profile {
        position: relative;
        overflow: hidden;
        padding: 0;
    }

    .profile-backdrop {
        height: 144px;
        margin-bottom: -64px;
    }

    .profile-header {
        display: grid;
        grid-template:
            "A B"
            "A C"
            "A D" 1fr / auto 1fr;
        column-gap: 12px;
        isolation: isolate;
    }

    .profile-avatar {
        grid-area: A;
        width: 96px;
        margin-left: 16px;
        border-radius: 0 0 var(--rounded-full) var(--rounded-full);
        filter: drop-shadow(var(--box-shadow-dark));
    }

    .profile-author {
        align-self: end;
        margin-top: 24px;
    }

    .profile-phrase {
        padding-block: 2px;
        color: var(--color-text-secondary);
    }

    .profile-links {
        display: flex;
        gap: 6px;
    }

    .profile-link {
        display: grid;
        place-items: center;
        width: 18px;
        aspect-ratio: 1;
        color: var(--color-info);

        &:hover {
            color: var(--color-theme-text);
        }
    }

    .profile-confession {
        display: grid;
        gap: 1lh;
        margin-left: auto;
        padding: 12px 16px;
        color: var(--color-text-secondary);
        isolation: isolate;
        writing-mode: vertical-rl;

        ruby {
            ruby-align: center;
        }
    }

    .profile-irregular {
        position: absolute;
        opacity: 0.2;
        inset: auto auto 24px 24px;
        font-family: var(--font-smooth);
        font-size: 48px;
        font-weight: bold;
        line-height: 1.2;
        color: var(--color-info);
    }
</style>
