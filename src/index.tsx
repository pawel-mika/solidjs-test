/* @refresh reload */
import { render } from 'solid-js/web';

import { Link, Router } from '@solidjs/router';
import App from './App';
import './index.css';

render(() => (
    <Router>
        <ul class="menu">
            <li><Link href={`${import.meta.env.BASE_URL}/gallery`}>Gallery</Link></li>
            <li><Link href={`${import.meta.env.BASE_URL}/tetris`}>Tetris</Link></li>
            <li><Link href="/test">Test</Link></li>
        </ul>
        <App />
    </Router>),
    document.getElementById('root') as HTMLElement);
