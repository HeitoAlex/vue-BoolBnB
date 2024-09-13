<script>
    import SingleProject from '../components/SingleProject.vue';
    import axios from 'axios';
    
    export default {
        components:{
            SingleProject
        },

        data(){
            return{
                project: null,
            }
        },

        methods:{
            getProject(id){
                axios.get(`http://127.0.0.1:8000/api/projects/${id}`, {
                    params: {
                    
                    }
                })
                .then((response) => {
                    console.log(response.data.results);
                    this.project = response.data.results;
                })
                .catch(function (error) {
                    console.log(error);
                })
                
            }
        },

        created(){
            this.getProject( this.$route.params.id );
        }
    }
</script>

<template>
    <div class="container">
        <div class="project-list">
            <SingleProject v-if=" project != null " :author="project.author" :image="project.image" :title="project.title" :content="project.content" :link="project.link"/>
        </div>
    </div>
</template>

<style scoped>

</style>