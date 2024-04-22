<script setup>
    const links = [
        {
            title: "Github",
            to: "https://github.com/KazariEX",
            icon: "fa6-brands:github"
        },
        {
            title: "Twitter",
            to: "https://twitter.com/KazariEX_0929",
            icon: "fa6-brands:twitter"
        },
        {
            title: "BiliBili",
            to: "https://space.bilibili.com/37810541",
            icon: "fa6-brands:bilibili"
        },
        {
            title: "RSS",
            to: "/feed",
            icon: "fa6-solid:rss"
        }
    ];
</script>

<template>
    <div class="content-table home-profile">
        <a class="profile-avatar">
            <nuxt-img :src="$config.public.avatar" alt="avatar"/>
        </a>
        <table class="profile-table">
            <tbody>
                <tr>
                    <th width="40%">作者</th>
                    <td>{{ $config.public.author }}</td>
                </tr>
                <tr>
                    <th>个人群</th>
                    <td><coco-link to="https://jq.qq.com/?_wv=1027&k=ezy4Y5TS" target="_blank">836164664</coco-link></td>
                </tr>
                <tr>
                    <th>读者群</th>
                    <td><coco-link to="https://jq.qq.com/?_wv=1027&k=pCxzWpRr" target="_blank">743284714</coco-link></td>
                </tr>
            </tbody>
        </table>
        <ul class="profile-link">
            <li v-for="{ title, to, icon } in links">
                <nuxt-link :to="to" :title="title" target="_blank">
                    <icon :name="icon"/>
                </nuxt-link>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .profile-table {
        border-spacing: 8px;
        font-size: 16px;
        text-align: center;

        td {
            border-bottom: 1px solid var(--color-border-lighter);
        }
    }

    .profile-avatar {
        display: block;
        width: min(80%, 256px);
        aspect-ratio: 1;
        margin: -32px auto 8px;
        border-radius: 100%;
        filter: drop-shadow(4px 12px 8px rgb(0 0 0 / 24%));

        &:hover {
            > img {
                animation: profile-avatar-jump 0.4s ease;
            }
        }

        > img {
            border-radius: inherit;
        }

        @keyframes profile-avatar-jump {
            50% {
                transform: rotateY(90deg) translateY(-32px);
            }
        }
    }

    .profile-link {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-inline: 8px;

        a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border: 1px solid var(--color-border-lighter);
            border-radius: 4px;
            font-size: 16px;
            color: var(--color-theme-dark);
        }
    }
</style>