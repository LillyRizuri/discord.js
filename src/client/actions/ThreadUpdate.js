'use strict';

const Action = require('./Action');
const Channel = require('../../structures/Channel');
const { ChannelTypes } = require('../../util/Constants');

class ThreadUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    let thread = client.threads.cache.get(data.id);
    if (thread) {
      const old = thread._update(data);

      if (ChannelTypes[thread.type.toUpperCase()] !== data.type) {
        const newThread = new Thread(thread.guild, data);
        for (const [id, message] of thread.messages.cache) {
			newThread.messages.cache.set(id, message);
		}
        newThread._typing = new Map(thread._typing);
        thread = newThread;
        this.client.threads.cache.set(thread.id, thread);
      }

      return {
        old,
        updated: thread,
      };
    }

    return {};
  }
}

module.exports = ThreadUpdateAction;
