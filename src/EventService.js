export default class EventService {
  constructor(eventName, location, startDate, endDate) {
    this.eventName = eventName;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  describeSelf() {
    return `${this.eventName} - ${this.startDate} - ${this.location}`;
  }

  submitAttendance() {
    // TODO: work this out
    console.log("Attending!");
  }
}