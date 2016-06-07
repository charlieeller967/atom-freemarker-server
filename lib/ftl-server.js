'use babel';

import FtlServerView from './ftl-server-view';
import FtlServerListView from './ftl-server-select-view';
import { CompositeDisposable } from 'atom';
import $ from 'jquery';
import h from 'vhtml';

/** @jsx h */

export default {
	ftlServerView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		console.log( 'ftl activate' );
		this.ftlServerView = new FtlServerView(state.ftlServerViewState);
		this.ftlServerListView = new FtlServerListView();

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.ftlServerView.destroy();
		this.filesizeTile.destroy();
		this.filesizeTile = null;
	},

	serialize() {
		return {
			ftlServerViewState: this.ftlServerView.serialize()
		};
	},

	consumeStatusBar(statusBar) {
		console.log( 'ftl consumeStatusBar' );

		const item = document.createElement('div');
		item.classList.add('ftl-server');
		item.classList.add('inline-block');
		item.innerHTML = (
			<div>
				<div class="indicator"></div>
				<a class="J_tip" href="javascript:;">
					haitaowap
				</a>
			</div>
		);
		this.filesizeTile = statusBar.addLeftTile({
			item,
			priority: 0
		});
		this.subscriptions.add(
			atom.tooltips.add(item.querySelector( '.tip' ), {
				title: 'ftl server',
				placement: 'top',
				trigger: 'hover',
				animation: false,
				delay: 0
			})
		);

		$(item.querySelector( '.J_tip' )).on('click', () => {
			console.log( 'clicked' );
			this.ftlServerListView.show();
		});
	},

	toggle() {
		console.log('FtlServer was toggled!');
	}

};
