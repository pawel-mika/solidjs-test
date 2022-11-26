/* @refresh reload */
import { render } from 'solid-js/web';

import { Link, Router } from '@solidjs/router';
import App from './App';
import './index.css';

const baseUrl = import.meta.env.BASE_URL;

render(() => (
    <Router>
        <ul class="menu">
            <li><Link href={baseUrl.concat('gallery')}>Gallery</Link></li>
            <li><Link href={baseUrl.concat('tetris')}>Tetris</Link></li>
            <li><Link href={baseUrl.concat('test')}>Test</Link></li>
        </ul>
        <App />
    </Router>),
    document.getElementById('root') as HTMLElement);
