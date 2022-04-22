'use strict';

const { InteractionResponseTypes } = require("../../util/Constants");
const MessageFlags = require("../../util/MessageFlags");
const APIMessage = require("../APIMessage");
class InteractionResponses {
	async defer({ ephemeral } = {}) {
		if (this.deferred || this.replied) {
			throw new Error("INTERACTION_ALREADY_REPLIED");
		}
		const res = await this.client.api.interactions(this.id, this.token).callback.post({
			data: {
				type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
				},
			},
		});
		this.deferred = true;
		return res;
	}

	async reply(content, options) {
		if (this.deferred || this.replied) {
			throw new Error("INTERACTION_ALREADY_REPLIED");
		}

		const apiMessage = content instanceof APIMessage
			? content
			: APIMessage.create(this, content, options);

		const { data, files } = await apiMessage.resolveData().resolveFiles();

		const res = await this.client.api.interactions(this.id, this.token).callback.post({
			data: {
				type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
				data,
			},
			files,
		});
		this.replied = true;
		return await this.fetchReply();
	}

	fetchReply() {
		return this.client.actions.MessageCreate.handle(this.webhook.fetchMessage("@original")).message;
	}

	editReply(content, options) {
		return this.webhook.editMessage("@original", content, options);
	}

	async deleteReply() {
		return await this.webhook.deleteMessage("@original");
	}

	followUp(content, options) {
		return this.webhook.send(content, options);
	}

	async deferUpdate() {
		if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");
		const res = await this.client.api.interactions(this.id, this.token).callback.post({
			data: {
				type: InteractionResponseTypes.DEFERRED_MESSAGE_UPDATE,
			},
		});
		this.deferred = true;
		return res;
	}

	/**
	 * Updates the original message whose button was pressed
	 * @param {string|APIMessage|MessageAdditions} content The content for the reply
	 * @param {WebhookEditMessageOptions} [options] Additional options for the reply
	 * @returns {Promise<void>}
	 * @example
	 * // Remove the buttons from the message
	 * interaction.update("A button was clicked", { components: [] })
	 *   .then(console.log)
	 *   .catch(console.error);
	 */
	async update(content, options) {
		if (this.deferred || this.replied) throw new Error("INTERACTION_ALREADY_REPLIED");
		const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
		const { data, files } = await apiMessage.resolveData().resolveFiles();

		const res = await this.client.api.interactions(this.id, this.token).callback.post({
			data: {
				type: InteractionResponseTypes.UPDATE_MESSAGE,
				data,
			},
			files,
		});
		this.replied = true;
		return res;
	}

	static applyToClass(structure, ignore = []) {
		const props = ["defer", "reply", "fetchReply", "editReply", "deleteReply", "followUp", "deferUpdate", "update"];
		for (const prop of props) {
			if (ignore.includes(prop)) continue;
			Object.defineProperty(
				structure.prototype,
				prop,
				Object.getOwnPropertyDescriptor(InteractionResponses.prototype, prop),
			);
		}
	}
};

module.exports = InteractionResponses;