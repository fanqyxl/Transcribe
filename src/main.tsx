import 'dreamland';
import './index.css';
import { fetch } from './epoxy';

import { StyleFromParams } from 'm3-dreamland';

import Home from './routes/home';

const App: Component<{}, { renderRoot: HTMLElement }> = function() {
	this.css = `
		width: 100%;
		height: 100%;
	`;

	return (
		<div id="app">
			<StyleFromParams scheme="vibrant" contrast={0} color="cba6f7" />
			<Home />
		</div>
	);
};

try {
	// throw "long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message long message "
	document.getElementById('app')!.replaceWith(<App />);
} catch (err) {
	const msg = document.createElement('div');
	msg.id = 'render-error';
	msg.innerHTML = "An error occurred while rendering the app.<br /><br />" + err;
	document.getElementById('app')!.appendChild(msg);
	console.error(err);
}

// weird workaround for tab process freezing
fetch('https://1.1.1.1', {
  headers: {
    'User-Agent': 'curl/6.9.0'
  }
})
