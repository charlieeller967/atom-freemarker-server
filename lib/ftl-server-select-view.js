'use babel';

import { SelectListView } from 'atom-space-pen-views';
import path from 'path';

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
	}
}
