<script>
	import { FlatToast, ToastContainer } from 'svelte-toasts';
</script>

<div class="background">
	<div class="app-container">
		<!-- the app gets slotted in here -->
		<slot />

		<!-- this handles displaying any toasts which need to be displayed -->
		<ToastContainer placement="top-center" let:data>
			<FlatToast {data} />
		</ToastContainer>
	</div>
</div>

<style>
	/* css variables used throughout the app */
	:global(*) {
		--orange: #e27d00;

		--navbar-top-height: 4rem;
		--navbar-bottom-height: 4rem;

		--max-app-width: 50rem;

		/* how many times bigger 1 rem has to be than 1% of the viewport width for units to use rem rather than be based off viewport width */
		/* this means that if the viewport width is small enough, everything that uses this ratio will start to shrink proportional to the viewport width */
		--rem-vw-ratio: 3.5;
	}

	/* formsnap label */
	:global([data-fs-label]) {
		--size: 2;
		--line-height: 2;

		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));
		padding: 0;
		margin: 0;

		color: var(--orange);
	}
	/* formsnap text input */
	:global([data-fs-input]) {
		--size: 1.5;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));

		border-radius: 0.5rem;

		font-family: 'Merriweather-Italic';
		text-align: center;
		box-sizing: border-box;
		border: 0.15rem solid #ccc;
		outline: none;
		box-shadow: 0 0.2rem 0.5rem 0 rgb(0, 0, 0);
	}
	/* formsnap focussed text input */
	:global([data-fs-input]:focus) {
		border: 0.15rem solid #555;
	}
	/* formsnap validation error message */
	:global([data-fs-validation]) {
		--size: 1;
		--line-height: 1;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));

		color: #ad0000;
		margin: 0;
		font-family: 'Merriweather-BlackItalic';
	}

	/* global styles of commonly used stuff*/
	/* for all the text html tags, I define 'size' and 'line height' which are both calculated 
    based on the rem-vw-ratio. This means the text will start to shrink when the viewport is below a certain width*/
	:global(p) {
		--size: 1.25;
		--line-height: 2;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));
		margin: 0;
	}
	:global(h3) {
		--size: 1.75;
		--line-height: 2.5;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));
		margin: 0;
		font-weight: normal;
	}
	:global(h2) {
		--size: 2.25;
		--line-height: 3.25;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));
		margin: 0;
		font-weight: normal;
	}
	:global(h1) {
		--size: 3;
		--line-height: 5;
		font-size: min(calc(var(--size) * 1rem), calc(var(--size) * var(--rem-vw-ratio) * 1vw));
		line-height: min(calc(var(--line-height) * 1rem), calc(var(--line-height) * var(--rem-vw-ratio) * 1vw));
		margin: 0;
	}

	:global(.orange-text) {
		color: var(--orange);
	}

	:global(.auth-wrapper) {
		line-height: 3rem;
		text-align: center;
	}
	:global(.auth-links) {
		line-height: 1rem;
		padding: 3rem 0 3rem 0;
	}
	:global(.auth-submit-container) {
		padding-top: 1rem;
	}

	:global(.orange) {
		background-color: var(--orange);
		margin: 0;
		color: white;
		box-shadow: 0 0 2rem 1rem rgba(0, 0, 0, 0.8);
		line-height: 2rem;
		font-size: 1.5rem;
		padding: 0.75rem 0 0.75rem;
		position: relative;
		/* cut off shadow everywhere but the bottom */
		clip-path: inset(0 0 -5rem 0);
	}

	:global(.wrapper) {
		background-color: white;
		text-align: center;
	}

	.background {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.app-container {
		/* make sure the app container is no bigger than the maximum width defined */
		width: min(100%, var(--max-app-width));
		/* 100dvh (dynamic viewport height) accounts for ios and android devices having address bars */
		min-height: 100dvh;
		box-shadow: 0 0 3rem 0.5rem;
		line-height: 2rem;
		/* if you overscroll you will see black */
		background-color: black;
	}

	/* if we add a div containing the id #noscroll, then scrolling won't work on this page */
	:global(#noscroll) {
		display: none;
	}
	:global(body:has(#noscroll)) {
		overflow: hidden;
	}
</style>
