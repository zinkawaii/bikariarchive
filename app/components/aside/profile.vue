<template>
    <aside-widget class="aside-profile">
        <div class="aside-backdrop"></div>
        <h3 class="aside-author">{{ $config.public.author }}</h3>
        <p class="aside-phrase">うたかたなしあわせ</p>
        <nuxt-img class="aside-avatar" :src="$config.public.avatar" alt="[avatar]"/>
    </aside-widget>
</template>

<style lang="scss" scoped>
    .aside-profile {
        display: grid;
        grid-template:
            "A A"
            "B D" 1fr
            "C D" auto / 1fr auto;
        place-items: end;
        overflow: hidden;
        height: 136px;
        padding: 0;
        isolation: isolate;
    }

    .aside-backdrop {
        grid-area: A;
        justify-self: stretch;
        height: 96px;
        background-image: cdn("/garden/outerworld.webp");
        background-position: center 10%;
        background-size: cover;
        mask-image: linear-gradient(to bottom, white, transparent);
        z-index: -1;

        @include dark {
            background-image: url("/garden/illustration/utakata_1.webp");
            background-position: center;
        }
    }

    .aside-author {
        margin-top: -100%;
    }

    .aside-phrase {
        padding-block: 2px 12px;
        font-size: 14px;
        color: var(--color-text-secondary);
    }

    .aside-avatar {
        grid-area: D;
        width: 96px;
        aspect-ratio: 1;
        margin: 0 -16px -8px 14px;
        filter: drop-shadow(0 0 4px rgb(0 0 0 / 16%));
    }
</style>
