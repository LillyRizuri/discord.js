'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, packet) => {
	const { old, updated } = client.actions.ThreadUpdate.handle(packet.d);
	if (old && updated) {
		/**
		 * Emitted whenever a thread is updated - e.g. name change, topic change, thread type change.
		 * @event Client#threadUpdate
		 * @param {Thread} oldThread The thread before the update
		 * @param {Thread} newThread The thread after the update
		 */
		client.emit(Events.THREAD_UPDATE, old, updated);
	}
};