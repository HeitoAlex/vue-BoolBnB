<script>

    export default {
        data(){
            return{
                
            }
        }
    }
</script>

<template>
    <div class="form-container content-wrapper-form">
        <div class="mb-3">
            <label for="name" class="form-label">Nome cliente</label>
            <input type="name" class="form-control" id="name" placeholder="Inserire il proprio nome">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email cliente</label>
            <input type="email" class="form-control" id="email" placeholder="user@example.com">
        </div>
        <div class="mb-3">
            <label for="info" class="form-label">Richiesta informazioni</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="10" placeholder="Inserire qui la richiesta di informazioni per il proprietario"></textarea>
        </div>
    </div>
</template>

<style scoped>
    .form-container{
        max-width: 1000px;
        margin: auto;
        margin-top: 7em;
        
    }

</style>