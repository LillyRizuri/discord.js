'use strict';

const BaseManager = require('./BaseManager');
const GuildChannel = require('../structures/GuildChannel');
const PermissionOverwrites = require('../structures/PermissionOverwrites');
const { ChannelTypes } = require('../util/Constants');
const Thread = require("../structures/Thread");

/**
 * Manages API methods for GuildChannels and stores their cache.
 * @extends {BaseManager}
 */
class GuildThreadManager extends BaseManager {
	constructor(thread, iterable) {
		super(thread.client, iterable, Thread);

		/**
		 * The guild this Manager belongs to
		 * @type {Thread}
		 */
		this.thread = thread;
	}

	/**
	 * The cache of this Manager
	 * @type {Collection<Snowflake, Thread>}
	 * @name GuildChannelManager#cache
	 */

	add(thread) {
		const existing = this.cache.get(thread.id);
		if (existing) return existing;
		this.cache.set(thread.id, thread);
		return thread;
	}
}

module.exports = GuildThreadManager;