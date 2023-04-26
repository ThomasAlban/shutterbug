<script lang="ts">
  import type { PageData } from "./$types";
  
  // get the data from +page.server.ts and store it in this variable
  export let data: PageData;
  // destructure the variable as we are only interested in users
  // the '$:' means that this statement is reactive. When 'data' changes, 'users' will be updated
  $: ({user} = data);
</script>
    
welcome, {user.username}!
<br>
<a href="/logout">Log Out</a>