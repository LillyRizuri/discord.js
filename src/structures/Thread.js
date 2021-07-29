'use strict';

const TextChannel = require("./TextChannel");

/**
 * Represents a guild store channel on Discord.
 * @author Lilly Rizuri
 * @date 28/07/2021
 * @class Thread
 * @extends {TextChannel}
 */
class Thread extends TextChannel {
	/**
	 * Creates an instance of Thread.
	 * @author Lilly Rizuri
	 * @date 28/07/2021
	 * @param {*} guild The guild the thread is part of.
	 * @param {*} data The data for the thread.
	 * @memberof Thread
	 */
	constructor(guild, data) {
		super(guild, data);

		/**
		 * The id of the user that started the thread.
		 * @author Lilly Rizuri
		 * @date 28/07/2021
		 * @type {?Snowflake}
		 * @memberof Thread
		 */
		this.ownerID = data?.owner_id || null;

		/**
		 * The number of messages in the thread.
		 * @author Lilly Rizuri
		 * @date 28/07/2021
		 * @type {number}
		 * @memberof Thread
		 */
		this.messageCount = data?.message_count || -1;

		/**
		 * The number of members in the thread.
		 * @author Lilly Rizuri
		 * @date 28/07/2021
		 * @type {number}
		 * @memberof Thread
		 */
		this.memberCount = data?.member_count || -1;

		/**
		 * Whether the thread is archived.
		 * @author Lilly Rizuri
		 * @date 28/07/2021
		 * @type {boolean}
		 * @memberof Thread
		 */
		this.archived = data?.thread_metadata?.archived || false;

		/**
		 * Whether the thread is locked; when a thread is locked, only users with `MANAGE_THREADS` can unarchive it.
		 * @author Lilly Rizuri
		 * @date 28/07/2021
		 * @type {boolean}
		 * @memberof Thread
		 */
		this.locked = data?.thread_metadata?.locked || false;

		if (data?.thread_metadata?.archive_timestamp !== void 0) {
			/**
			 * The timestamp the thread was archived on.
			 * @author Lilly Rizuri
			 * @date 28/07/2021
			 * @type {number}
			 * @memberof Thread
			 */
			this.archiveTimestamp = new Date(data?.thread_metadata?.archive_timestamp).valueOf();
		}

		/**
		 * The duration in minutes to automatically archive the thread after recent activity.
		 * @author Lilly Rizuri
		 * @date 28/07/2021
		 * @type {number}
		 * @memberof Thread
		 */
		this.autoArchiveDuration = data?.thread_metadata?.auto_archive_duration || -1;
	}

	/**
	 * Whether the thread is deletable by the client user
	 * @author Lilly Rizuri
	 * @date 28/07/2021
	 * @type {boolean}
	 * @readonly
	 * @memberof Thread
	 */
	get deletable() {
		return this.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_THREADS, false);
	}

	/**
	 * Deletes this thread.
	 * @author Lilly Rizuri
	 * @date 28/07/2021
	 * @param {string} [reason] Reason for deleting this thread.
	 * @returns {Promise<Thread>}
	 * @memberof Thread
	 */
	delete(reason) {
		return this.client.api
			.channels(this.id)
			.delete({ reason })
			.then(() => this);
	}
}

module.exports = Thread;