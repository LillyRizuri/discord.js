'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    let channel = this.getChannel(data);
	if (!channel) {
		channel = this.getThread(data);
	}
    let message;
    if (channel) {
      message = this.getMessage(data, channel);
      if (message) {
        channel.messages.cache.delete(message.id);
        message.deleted = true;
        /**
         * Emitted whenever a message is deleted.
         * @event Client#messageDelete
         * @param {Message} message The deleted message
         */
        client.emit(Events.MESSAGE_DELETE, message);
      }
    }

    return { message };
  }
}

module.exports = MessageDeleteAction;
