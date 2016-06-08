'use babel';

import FtlServerListView from './freemarker-server-select-view';
import { CompositeDisposable } from 'atom';
import $ from 'jquery';
import h from 'vhtml';

/** @jsx h */

export default {
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.ftlServerListView = new FtlServerListView();
		this.subscriptions = new CompositeDisposable();
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.filesizeTile.destroy();
		this.filesizeTile = null;
	},

	serialize() {
		return {};
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
				title: 'freemarker server',
				placement: 'top',
				trigger: 'hover',
				animation: false,
				delay: 0
			})
		);

		$( item ).on('click', '.J_tip', () => {
			this.ftlServerListView.show();
		});
	}
};
