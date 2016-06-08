'use babel';

import { SelectListView } from 'atom-space-pen-views';
import { MessagePanelView, PlainMessageView } from 'atom-message-panel';
import path from 'path';
import { spawn } from 'child_process';
import split from 'split';
import Combine from 'combine-stream';
import { ansiToHtml, htmlToDom } from './util';

const cwd = process.cwd();

let pool = {};
export default class FtlServerListView extends SelectListView {
	initialize() {
		super.initialize();
		this.addClass('overlay from-top');
		this.panel = atom.workspace.addModalPanel({ item: this });
	}

	viewForItem(item) {
		return `<li>${item.name}</li>`;
	}

	confirmed(item) {
		this.storeFocusedElement();
		this.hide();
		console.log( item, `was selected` );
		this.server( item.name, item.path );
	}

	server( name, root ) {
		console.log( path.resolve( __dirname, './server.js' ) );
		console.log( 'serving root', root );

		const cp = spawn(
			'node',
			[ path.resolve( __dirname, './server.js' ) ],
			{
				cwd: root,
			}
		);
		pool[ name ] = cp;

		console.log( 'cp', cp );

		const panel = new MessagePanelView({
			title: 'Freemarker Server',
			autoScroll: true
		});
		panel.attach();
		panel.toggle();

		const output = new Combine([ cp.stdout, cp.stderr ]);
		output.pipe( split() ).on('data', ( line ) => {
			line = ansiToHtml( line ).replace(/ /g, function( match, offset, total ) {
				if( /^ *$/.test( total.slice( 0, offset ) ) ) {
					return '&nbsp;';
				} else {
					return ' ';
				}
			})
			panel.add(new PlainMessageView({
				message: line,
				raw: true
			}));
			panel.updateScroll();
		});

		cp.on('close', function (code) {
			console.log('child process exited with code ' + code);
		});
	}

	killProcess( name ) {

	}

	cancelled() {
		this.hide();
	}

	show() {
		let projects = atom.project.getPaths();

		let i = 0;
		projects = projects.map(item => ({
			id: i++,
			path: item,
			name: path.basename( item )
		}));

		this.setItems( projects );
		this.panel.show();
		this.focusFilterEditor();
	}

	hide() {
		this.panel.hide();
	}

	// Returns an object that can be retrieved when package is activated
	serialize() {}

	// Tear down any state and detach
	destroy() {
		this.panel.destroy();
		for( let i in pool ) {
			pool[ i ].kill();
		}
	}
}
