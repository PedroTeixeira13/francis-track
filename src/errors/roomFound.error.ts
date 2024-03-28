export class RoomFoundError extends Error {
  constructor () {
    super('Room name in use')
  }
}