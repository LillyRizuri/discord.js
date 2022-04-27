'use strict';

const Action = require('./Action');
const { Events, Status } = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {
	handle(data, shard) {
		const client = this.client;
		const guild = client.guilds.cache.get(data.guild_id);
		let member = null;
		if (guild) {
			member = this.getMember({ user: data.user }, guild);
			if (member === void 0) {
				try {
					guild.members.fetch({ user: data.user.id, force: true });
				} catch { }
				member = this.getMember({ user: data.user }, guild);
			}
			guild.memberCount--;
			if (member) {
				member.deleted = true;
				guild.members.cache.delete(member.id);
				/**
				 * Emitted whenever a member leaves a guild, or is kicked.
				 * @event Client#guildMemberRemove
				 * @param {GuildMember} member The member that has left/been kicked from the guild
				 */
				if (shard.status === Status.READY) client.emit(Events.GUILD_MEMBER_REMOVE, member);
			}
			guild.voiceStates.cache.delete(data.user.id);
		}
		return { guild, member: member ?? this.getUser(data.user) };
	}
}

module.exports = GuildMemberRemoveAction;
