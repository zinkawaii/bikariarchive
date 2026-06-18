<script lang="ts" setup>
  const contextMenuStore = useContextMenuStore();
  const router = useRouter();

  const links = [
    {
      title: "GitHub",
      to: "https://github.com/KazariEX",
      icon: "ri:github-fill",
    },
    {
      title: "Twitter",
      to: "https://twitter.com/KazariEX_0929",
      icon: "ri:twitter-fill",
    },
    {
      title: "BiliBili",
      to: "https://space.bilibili.com/37810541",
      icon: "ri:bilibili-fill",
    },
    {
      title: "QQ",
      to: "https://jq.qq.com/?_wv=1027&k=ezy4Y5TS",
      icon: "ri:qq-fill",
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
        icon: "fa7-solid:comment-dots",
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
    <div class="profile-story">
      <p class="profile-line">あなただけのために存在する<ruby>世界<rt>イレギュラー</rt></ruby>、</p>
      <p class="profile-line">それが物語。</p>
      <p class="profile-line"></p>
    </div>
    <div class="profile-irregular">Silent,<br />Irregular.</div>
  </div>
</template>

<style lang="scss" scoped>
  .home-profile {
    padding: 0 16px;
    text-wrap: nowrap;
  }

  .profile-backdrop {
    height: 144px;
    margin: 0 -16px -64px;
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
    gap: 4px;
  }

  .profile-link {
    display: grid;
    place-items: center;
    width: 20px;
    aspect-ratio: 1;
    color: var(--color-info);

    &:hover {
      color: var(--color-theme-text);
    }
  }

  .profile-story {
    margin-block: 12px;
    color: var(--color-text-secondary);
    ruby-align: center;
  }

  .profile-line {
    min-height: 28px;
    padding-top: 6px;
    border-bottom: 1px solid var(--color-gray-800);
  }

  .profile-irregular {
    opacity: 0.2;
    margin-block: 16px;
    font-family: var(--font-smooth);
    font-size: 48px;
    font-weight: bold;
    line-height: 1.1;
    text-align: right;
    color: var(--color-info);
    user-select: none;
  }
</style>
