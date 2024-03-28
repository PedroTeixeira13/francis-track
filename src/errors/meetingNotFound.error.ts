export class MeetingNotFoundError extends Error {
  constructor() {
    super('Meeting not found');
  }
}
