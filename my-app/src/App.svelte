<script>
	export let name;
	import axios from 'axios';

	const apiKey = process.env.MY_API_KEY;

	let title = `loading....`;
	let error = null;

	const fetchQuote = async () => {
		try {
			const response = await axios.get('https://api.api-ninjas.com/v1/quotes?', {
				headers: {'x-api-key': apiKey},
			});
			title = response.data[0]?.quote || "No quote available";
		} catch (err){
			error = 'An error ocurred, failed to get quotes.';
			console.log(error);
		}
	}
	const updateTitle = () => {
		fetchQuote();
	};

	fetchQuote();
	
</script>

<div class="index">
	<h1>Hello, {name}</h1>
	<p>
		{#if error}
			{error}
		{:else}
			{title}
		{/if}
	</p>

	<button on:click={updateTitle}>Change quote</button>
</div>

<style>
	div {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		div {
			max-width: none;
		}
	}
</style>
