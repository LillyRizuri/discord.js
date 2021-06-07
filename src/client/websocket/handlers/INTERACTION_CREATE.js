'use strict';

const { Events, InteractionTypes, MessageComponentTypes } = require('../../../util/Constants');
let Structures;

module.exports = (client, { d: data }) => {
  let InteractionType;
  switch (data.type) {
    case InteractionTypes.APPLICATION_COMMAND: {
      if (!Structures) Structures = require('../../../util/Structures');
      InteractionType = Structures.get('CommandInteraction');
      break;
    }
    case InteractionTypes.MESSAGE_COMPONENT: {
      if (!Structures) Structures = require('../../../util/Structures');
      switch (data.data.component_type) {
        case MessageComponentTypes.BUTTON:
          InteractionType = Structures.get('ButtonInteraction');
          break;
        case MessageComponentTypes.SELECT_MENU:
          InteractionType = Structures.get('SelectMenuInteraction');
          break;
        default:
          client.emit(
            Events.DEBUG,
            `[INTERACTION] Received interaction with unknown component type: ${data.data.component_type}`,
          );
          return;
      }
      break;
    }
    default:
      client.emit(Events.DEBUG, `[INTERACTION] Received interaction with unknown type: ${data.type}`);
      return;
  }

  /**
   * Emitted when an interaction is created.
   * @event Client#interaction
   * @param {Interaction} interaction The interaction which was created
   */
  client.emit(Events.INTERACTION_CREATE, new InteractionType(client, data));
};
