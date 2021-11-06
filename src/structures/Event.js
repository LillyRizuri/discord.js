'use strict';
const Base = require('./Base'),
  SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Event go brr.
 * @author Lilly Rizuri
 * @date 06/11/2021
 * @class Event
 * @extends {Base}
 */
class Event extends Base {
  /**
   * Creates an instance of Event.
   * @author Lilly Rizuri
   * @date 06/11/2021
   * @param {{}} data
   * @param {import("../client/Client")} client
   * @param {import("./Guild")} guild
   * @memberof Event
   */
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that the event is taking place in.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {Guild}
     * @memberof Event
     */
    this.guild = guild;

    /**
     * The id of the event.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {string}
     * @memberof Event
     */
    this.id = data?.id;

    /**
     * The id of the user that created the event.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {string}
     * @memberof Event
     */
    this.creatorID = data?.creator_id || null;

    /**
     * The id of the channel the event takes place in.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {string}
     * @memberof Event
     */
    this.channelID = data?.channel_id || null;

    /**
     * The topic of the event.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {string}
     * @memberof Event
     */
    this.name = data?.name || null;

    /**
     * The name of the event.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {?string}
     * @memberof Event
     */
    this.description = data?.name || null;

    /**
     * Idk what this even is
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {?number}
     * @memberof Event
     */
    this.privacyLevel = data?.privacy_level || null;

    /**
     * The date the event is scheduled to start on.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {?number}
     * @memberof Event
     */
    this.startTimestamp = new Date(data?.scheduled_start_time).valueOf() || null;

    /**
     * The date the event is scheduled to end on.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {?number}
     * @memberof Event
     */
    this.endTimestamp = new Date(data?.scheduled_end_time).valueOf() || null;

    /**
     * The type of event.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {( "STAGE_CHANNEL" | "VOICE_CHANNEL" | "OTHER" )}
     * @memberof Event
     */
    this.type = {
      1: 'STAGE_CHANNEL',
      2: 'VOICE_CHANNEL',
      3: 'OTHER',
    }[data.entity_type];

    /**
     * The location of the event.
     * @author Lilly Rizuri
     * @date 06/11/2021
     * @type {( import("./StageChannel") | import("./VoiceChannel") | string )}
     * @memberof Event
     */
    this.location = null;

    if (this.type === 'OTHER') {
      this.location = data?.entity_metadata?.location || this.location;
    } else {
      Object.defineProperty(this, 'location', {
        get: () => {
          if (!this.client.channels.cache.has(data.channel_id)) {
            this.client.channels.fetch(data.channel_id);
          }

          return this.client.channels.cache.get(data.channel_id);
        },
      });
    }
  }

  get topic() {
    return this.name;
  }

  /**
   * The timestamp the role was created at.
   * @author Lilly Rizuri
   * @date 06/11/2021
   * @type {number}
   * @readonly
   * @memberof Event
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * @description
   * @author Lilly Rizuri
   * @date 06/11/2021
   * @param {{ type: ( import("./StageChannel") | import("./VoiceChannel") | string ), startTimestamp: ?number, endTimestamp: ?number, name: ?string, description: ?string, location: (import("./StageChannel") | import("./VoiceChannel") | string) }} data
   * @returns {*}
   * @memberof Event
   */
  edit(data) {
    let _data = {
      entity_type: [0, 'STAGE_CHANNEL', 'VOICE_CHANNEL', 'OTHER'].indexOf(data.type ?? this.type),
    };

    return this.client.api['guild-events'][this.id]
      .patch({
        data: {
          channel_id: this.entity_type === 3 ? null : data?.location?.id,
          description: data.description ?? this.description,
          entity_metadata: this.entity_type === 3 ? { location: data.location ?? this.location } : null,
          image: null,
          name: data.name ?? this.name,
          privacy_level: this.privacyLevel,
          scheduled_end_time: new Date(data.endTimestamp ?? this.endTimestamp).toISOString(),
          scheduled_start_time: new Date(data.startTimestamp ?? this.startTimestamp).toISOString(),
          ..._data,
        },
      })
      .then(event => new Event(this.client, event, this.guild));
  }
}

module.exports = Event;
