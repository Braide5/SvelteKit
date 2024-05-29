<script>
	const getTitle = () => titles[index];

	const updateTitle = () => {
		index = index === 9 ? 0 : index + 1;
		title = getTitle();
	};

	async function fetchRandomJoke() {
		try {
			const response = await fetch(
				"https://official-joke-api.appspot.com/random_joke",
				{
					headers: {
						method: "GET",
						contentType: "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				},
			);
			const data = await response.json();

			return data;
		} catch (error) {
			console.error("Error fetching joke:", error);
			return "Sorry, couldn't fetch a joke at the moment.";
		}
	}

	// Call the function to fetch a random joke
	fetchRandomJoke()
		.then((joke) => {
			console.log(joke);
		})
		.catch((error) => {
			console.error("Error fetching joke:", error);
		});

	const titles = [
		"You are beautiful",
		"It is a lovely day",
		"Well done is better than well said.",
		"You must be the change you wish to see in the world",
		"Spread love everywhere you go. ",
		"The only thing we have to fear is fear itself. ",
		"Darkness cannot drive out darkness: only light can do that.",
		"Do one thing every day that scares you.",
		"You are nice",
	];
	let index = 0;
	let title = getTitle();
</script>

<div class="index">
	<h1>Hello</h1>
	<p>
		{title}
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
