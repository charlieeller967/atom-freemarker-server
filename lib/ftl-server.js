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
		this.ftlServerView = new FtlServerView(state.ftlServerViewState);
		this.ftlServerListView = new FtlServerListView();
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
		const item = document.createElement('div');
		item.classList.add('ftl-server');
		item.classList.add('inline-block');
		item.innerHTML = (
			<div>
				<div class="indicator"></div>
				<a class="J_tip" href="javascript:;">
					freemarker server
				</a>
			</div>
		);
		this.filesizeTile = statusBar.addLeftTile({
			item,
			priority: 0
		});
		this.subscriptions.add(
			atom.tooltips.add(item.querySelector( '.J_tip' ), {
				title: 'ftl server',
				placement: 'top',
				trigger: 'hover',
				animation: false,
				delay: 0
			})
		);

		$(item.querySelector( '.J_tip' )).on('click', () => {
			this.ftlServerListView.show();
		});
	}
};
