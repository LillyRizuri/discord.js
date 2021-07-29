'use strict';

const BaseManager = require("./BaseManager");
const Channel = require("../structures/Channel");
const Thread = require("../structures/Thread");
const { Events } = require("../util/Constants");

/**
 * A manager of channels belonging to a client
 * @author Lilly Rizuri
 * @date 28/07/2021
 * @class ThreadManager
 * @extends {BaseManager}
 */
class ThreadManager extends BaseManager {
	constructor(client, iterable) {
		super(client, iterable, Channel);
	}

	/**
	 * The cache of Threads
	 * @type {Collection<Snowflake, Thread>}
	 * @name ChannelManager#cache
	 */

	add(data, guild, cache = true) {
		const existing = this.cache.get(data.id);
		if (existing) {
			if (existing._patch && cache) {
				existing._patch(data);
			}
			if (guild) {
				// guild.channels.add(existing);
			}
			return existing;
		}
		
		guild = guild || this.client.guilds.cache.get(data.guild_id);

		const thread = new Thread(guild, data);

		
		if (!thread) {
			this.client.emit(Events.DEBUG, `Failed to find guild, or unknown type for channel or thread ${data.id} ${data.type}`);
			return null;
		}

		guild.threads.cache.set(thread.id, thread);

		if (cache) {
			this.cache.set(thread.id, thread);
		}

		return thread;
	}

	remove(id) {
		const thread = this.cache.get(id);
		thread?.guild?.threads.cache.delete(id);
		this.cache.delete(id);
	}
}

module.exports = ThreadManager;
