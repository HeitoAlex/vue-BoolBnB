<script>

    export default {
        data(){
            return{
                
            }
        },

        props:{
            title:{
                typeof: String,
                required: true
            },
            
            rooms_num:{
                typeof: Number,
                required: true
            },

            beds_num:{
                typeof: Number,
                required: true
            },

            bathroom_num:{
                typeof: Number,
                required: true
            },
            
            sq_mt:{
                typeof: Number,
                required: true
            },

            address:{
                typeof: String,
                required: true
            },

            images:{
                typeof: String,
                required: true
            },

            visibility:{
                typeof: String,
                required: true
            }
        }
    }
</script>

<template>
    <div class="card me-3 mb-2" style="width: 18rem;">
        <div class="card-header">{{ title }}</div>
        <img :src="images" class="card-img-top" alt="immagine appartamento">
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