'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { RangeError } = require('../errors');
const { MessageButtonStyles, MessageComponentTypes } = require('../util/Constants');
const Util = require('../util/Util');

/**
 * Represents a Select Menu message component.
 * @extends {BaseMessageComponent}
 */
class MessageSelectMenu extends BaseMessageComponent {
	/**
	 * @typedef {object} SelectChoice
	 * @property {string} [label] The user-facing name of the option, max 25 characters.
	 * @property {string} [value] The dev-define value of the option, max 100 characters.
	 * @property {string} [description] An additional description of the option, max 50 characters.
	 * @property {Emoji} [emoji] The emoji.
	 * @property {boolean} [default=false] Will render this option as selected by default.
	 */

	/**
	 * @typedef {BaseMessageComponentOptions} MessageSelectMenuOptions
	 * @property {string} [placeholder] The text to be displayed on this menu as a placeholder.
	 * @property {string} [customID] A unique string to be sent in the interaction.
	 * @property {SelectChoice[]} [options] The options for this menu.
	 * @property {number} [minValues] The minimum number of items that must be chosen; default 1, min 0, max 25.
	 * @property {number} [maxValues] The maximum number of items that can be chosen; default 1, max 25.
	 * @property {boolean} [disabled=false] Disables the menu to prevent interactions.
	 */

	/**
	 * @param {MessageSelectMenu|MessageSelectMenuOptions} [data={}] MessageButton to clone or raw data
	 */
	constructor(data = {}) {
		super({ type: 'SELECT_MENU' });

		this.setup(data);
	}

	setup(data) {
		/**
		 * The text to be displayed on this button
		 * @type {?string}
		 */
		this.placeholder = data.label ?? data.placeholder ?? null;

		/**
		 * A unique string to be sent in the interaction.
		 * @type {?string}
		 */
		this.customID = data.custom_id ?? data.customID ?? null;

		/**
		 * The options for the menu.
		 * @type {?SelectChoice[]}
		 */
		this.options = data.options ?? data.options ?? null;

		/**
		 * The maximum number of items that can be chosen; default 1, max 25.
		 * @type {?number}
		 */
		this.maxValues = data.max_values ?? data.maxValues ?? null;

		/**
		 * The minimum number of items that must be chosen; default 1, min 0, max 25.
		 * @type {?number}
		 */
		this.minValues = data.min_values ?? data.minValues ?? null;

		/**
		 * Whether this menu is currently disabled
		 * @type {?boolean}
		 */
		this.disabled = data.disabled ?? false;
	}

	/**
	 * Sets the custom ID of this button
	 * @param {string} customID A unique string to be sent in the interaction when clicked
	 * @returns {MessageButton}
	 */
	addOption(label, value, description, emoji, isDefault = false) {
		this.addOptions({label, value, description, emoji, isDefault = false});
		return this;
	}

	/**
	 * Adds options to the menu.
	 * @param {MessageSelectMenuOptions[]} options
	 * @returns {MessageButton}
	 */
	addOptions(options) {
		this.options.push(...this.constructor.normalizeOptions(options));
		return this;
	}

	/**
	 * Sets the custom ID of this button
	 * @param {string} customID A unique string to be sent in the interaction when clicked
	 * @returns {MessageButton}
	 */
	setCustomID(customID) {
		this.customID = Util.verifyString(customID, RangeError, 'BUTTON_CUSTOM_ID');
		return this;
	}

	/**
	 * Sets the interactive status of the button
	 * @param {boolean} disabled Whether this button should be disabled
	 * @returns {MessageButton}
	 */
	setDisabled(disabled) {
		this.disabled = disabled;
		return this;
	}

	/**
	 * Sets the minimum number of items that must be chosen.
	 * @param {number} min
	 * @returns {MessageButton}
	 */
	setMin(disabled) {
		this.minValues = parseInt(min);
		return this;
	}

	/**
	 * Sets the maximum number of items that can be chosen.
	 * @param {number} max
	 * @returns {MessageButton}
	 */
	setMax(max) {
		this.maxValues = parseInt(max);
		return this;
	}

	/**
	 * Sets the placeholder text for the menu.
	 * @param {string} placeholder The text to be displayed on this button
	 * @returns {MessageButton}
	 */
	setPlaceholder(placeholder) {
		this.placeholder = Util.verifyString(placeholder, RangeError, "MENU_PLACEHOLDER");
		return this;
	}

	/**
	 * Transforms the button to a plain object.
	 * @returns {Object} The raw data of this button
	 */
	toJSON() {
		return {
			custom_id: this.customID,
			disabled: this.disabled,
			options: this.options,
			placeholder: this.placeholder,
			options: this.options,
			max_values: this.maxValues,
			min_values: this.minValues,
		};
	}

	/**
	 * Normalizes option input and resolves strings.
	 * @param {string} label The label of the option.
	 * @param {string} value The value of the option.
	 * @param {?string} [description] The description of the option.
	 * @param {?Emoji} [emoji] The emoji for the option.
	 * @param {?boolean} [isDefault=false] Set the option to default.
	 * @returns {MenuOptionData}
	 */
	static normalizeOption(label, value, description, emoji, isDefault = false) {
		return {
			label: Util.verifyString(label, RangeError, 'MENU_OPTION_LABEL', false),
			value: Util.verifyString(value, RangeError, 'MENU_OPTION_VALUE', false),
			description,
			emoji,
			"default": isDefault,
		};
	}

	/**
	 * @typedef {Object} MenuOptionData
	 * @param {string} label The label of the option.
	 * @param {string} value The value of the option.
	 * @param {?string} [description] The description of the option.
	 * @param {?Emoji} [emoji] The emoji for the option.
	 * @param {?boolean} [isDefault=false] Set the option to default.
	 */

	/**
	 * Normalizes option input and resolves strings.
	 * @param  {...MenuOptionData|MenuOptionData[]} options Options to normalize
	 * @returns {MenuOptionData[]}
	 */
	static normalizeOptions(...options) {
		return options
			.flat(2)
			.map(option =>
				this.normalizeOption(
					option && option.name,
					option && option.value,
					option && option?.description,
					option && option?.emoji,
					option && option?.isDefault,
				),
			);
	}
}

module.exports = MessageSelectMenu;