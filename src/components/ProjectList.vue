<script>
    import SingleProject from './SingleProject.vue';
    import axios from 'axios';
    
    export default {
        components:{
            SingleProject
        },

        data(){
            return{
                projects: [],
            }
        },

        methods:{
            getProjects(){
                axios.get('http://127.0.0.1:8000/api/projects', {
                    params: {
                    
                    }
                })
                .then((response) => {
                    console.log(response.data.results.data);
                    this.projects = response.data.results.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
                
            }
        },

        created(){
            this.getProjects();
        }
    }
</script>

<template>
    <div class="container">
        <div class="project-list">
            <router-link v-for="project in projects" :to="{ name: 'project' , params:{ id: project.id } } ">
                <SingleProject :author="project.author" :image="project.image" :title="project.title" :content="project.content" :link="project.link"/>
            </router-link>
        </div>
    </div>
</template>

<style >

    .container{
        width: 1000px;
    }

    .project-list{
        margin-top: 3rem;
        display: flex;
        flex-wrap: wrap;
    }
</style>