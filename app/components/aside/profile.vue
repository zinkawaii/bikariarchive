<template>
    <aside-widget class="aside-profile">
        <profile-backdrop light="10%"/>
        <h3 class="profile-author">{{ $config.public.author }}</h3>
        <p class="profile-phrase">{{ $config.public.phrase }}</p>
        <nuxt-img class="profile-avatar" :src="$config.public.avatar" alt="[avatar]"/>
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

    .profile-backdrop {
        grid-area: A;
        justify-self: stretch;
        height: 96px;
        z-index: -1;
    }

    .profile-author {
        margin-top: -100%;
    }

    .profile-phrase {
        padding-block: 2px 12px;
        font-size: 14px;
        color: var(--color-text-secondary);
    }

    .profile-avatar {
        grid-area: D;
        width: 96px;
        aspect-ratio: 1;
        margin: 0 -16px -8px 14px;
        filter: drop-shadow(0 0 4px rgb(0 0 0 / 16%));
    }
</style>
