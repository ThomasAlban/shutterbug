<script lang="ts"> 
  export let data;
  $: ({user} = data);
</script>
    
welcome, {user.username}!
<br>
<a href="/logout">Log Out</a>