<script>

    export default {
        data(){
            return{
                
            }
        },

        props:{
            author:{
                typeof: String,
                required: true
            },

            title:{
                typeof: String,
                required: true
            },

            link:{
                typeof: String,
                required: true
            },

            image:{
                typeof: String,
                required: true
            },

            content:{
                typeof: String,
                required: true
            }
        }
    }
</script>

<template>
    <div class="card me-3 mb-2" style="width: 18rem;">
        <div class="card-header">{{ author }}</div>
        <img :src="image" class="card-img-top" alt="project image">
        <div class="card-body">
            <h3 class="card-title">{{ title }}</h3>
            <p class="card-text">{{ content }}</p>
        </div>
        <div class="card-body">
            <a href="#" class="card-link">{{ link }}</a>
        </div>
    </div>
</template>

<style >

</style>