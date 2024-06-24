<script>
	let name = 'World';
	const apiKey = import.meta.env.VITE_API_KEY;

	/**
	 * @type {string | null}
	 */
	let error = null;

	/**
	 * @type {string }
	 */
	let title = 'Please click on the button to get a quote.';

	/**
	 * @type {boolean}
	 */
	let isLoading = false;

	const fetchQuote = async () => {
		try {
			isLoading = true;

			const response = await fetch('https://api.api-ninjas.com/v1/quotes?', {
				headers: { 'x-api-key': apiKey }
			});

			if (!response.ok) {
				error = 'An error ocurred, failed to get quotes.';
				console.log(error);
				return;
			}

			const data = await response.json();
			title = data[0].quote || 'No quote available';
		} catch (err) {
			error = 'An error ocurred, failed to get quotes.';
			console.log(error);
		} finally {
			isLoading = false;
		}
	};
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

	<button on:click={fetchQuote}>
		{#if isLoading}
			{'Fetching...'}
		{:else}
			{'Change Quote'}
		{/if}
	</button>
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
