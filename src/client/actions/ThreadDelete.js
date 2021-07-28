'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const Thread = require("../../structures/Thread");

class ThreadDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;
    let thread = client.threads.cache.get(data.id);

    if (thread) {
      client.threads.remove(thread.id);
      thread.deleted = true;
      /**
       * Emitted whenever a thread is deleted.
       * @event Client#channelDelete
       * @param {Thread} thread The thread that was deleted
       */
      client.emit(Events.THREAD_DELETE, thread);
    }

    return { thread };
  }
}

module.exports = ThreadDeleteAction;
