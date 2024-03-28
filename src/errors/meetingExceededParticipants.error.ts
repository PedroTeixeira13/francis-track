export class MeetingExceededParticipantsError extends Error {
  constructor() {
    super('Number of participants greater than the room capacity.');
  }
}
