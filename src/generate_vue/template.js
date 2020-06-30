module.exports = function(name) {
return `
<template>
    <div>
        这是${name}页面
    </div>
</template>

<script>
export default {
    name: '${name}',
    data() {
        return {}
    },
    created() {}
}
</script>

<style scoped lang="scss">

</style>
`
}