import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world',
		target: document.body
	}
});

export default app;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}