<script>

    export default {
        data(){
            return{
                navLinks: [
                    {
                        label: "Home",
                        name: "home"
                    },
                    // {
                    //     label: "Project",
                    //     name: "project"
                    // },
                    {
                        label: "Contacts",
                        name: "contacts"
                    },
                ] 
            }
        }
    }
</script>

<template>
    <header>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <ul class="d-flex list-unstyled">
                    <li class="me-3" v-for=" navlink in navLinks">
                        <router-link :to="{ name: navlink.name }">
                            {{ navlink.label }}
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<style scoped>

</style>