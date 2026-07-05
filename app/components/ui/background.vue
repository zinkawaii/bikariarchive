<template>
  <div class="z-background"></div>
</template>

<style scoped>
  .z-background {
    display: grid;
    position: fixed;
    inset: 0;
    height: 100lvh;
    background-image: var(--image);
    background-position: center;
    background-size: cover;

    [theme="hatsusora"] & {
      --image: url("/api/image/background/hatsusora.webp");
    }

    [theme="ayame"] & {
      --image: url("/api/image/background/ayame.webp");
    }

    [theme="sakura"] & {
      --image: url("/api/image/background/sakura.webp");
    }

    [z-dark] & {
      --image: url("/api/image/background/dark.webp");
    }

    @media (width < 596px) {
      &::after {
        content: "";
        background-color: var(--color-background-alpha);
      }
    }
  }
</style>
