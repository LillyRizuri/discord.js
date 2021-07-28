'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class ThreadCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.threads.cache.has(data.id);
    const thread = client.threads.add(data);
    if (!existing && thread) {
      /**
       * Emitted whenever a thread is created.
       * @event Client#threadCreate
       * @param {Thread} thread The thread that was created
       */
      client.emit(Events.THREAD_CREATE, thread);
    }
    return { thread };
  }
}

module.exports = ThreadCreateAction;