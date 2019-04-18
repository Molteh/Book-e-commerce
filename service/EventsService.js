'use strict';

const {database} = require("./Database");
const _ = require("lodash");


/**
 * Returns the full description of an Event.
 *
 * event_id Long The id of the desired event.
 * returns Event
 **/
exports.eventsEventIdGET = async (event_id) => {
  //retrieve the desired event
  const event = (await database("event").select("book_id","location","date","imgpath","description","organiser_email").where("event_id","=",event_id))[0];

  //if the event doesn't exist
  if(!event) throw {code: 404};

  return event;
};


/**
 * Returns a list of all the events.
 *
 * offset Long Offset with regards to the current page. (optional)
 * limit Long Items per page. (optional)
 * returns List
 **/
exports.eventsGET = async (offset,limit) => {
  //retrieve a preview of all the events of the month
  const events = await database("event").select("event_id","book_id","location","date","imgpath").limit(limit).offset(offset);

  //format the response
  const result = [];
  for(let i=0; i<events.length; i++) {
    result[i] = {
      "event_id" : events[i].event_id,
      "event" : _.pick(events[i], ["book_id", "location", "date", "imgpath"])
    }
  }

  return result;
};
