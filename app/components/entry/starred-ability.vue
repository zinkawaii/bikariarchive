<template>
    <template v-for="i in 6">
        <h3>Star {{ 6 - i }}</h3>
        <entry-known-ability :star="6 - i"/>
    </template>
</template>

<style lang="scss" scoped>
    .entry-known-ability {
        margin-left: 2em;
    }
</style>
