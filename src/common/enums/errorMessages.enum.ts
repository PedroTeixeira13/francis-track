export enum UsersExceptionMessage {
  NOT_FOUND = 'User not found.'
}

export enum AuthExceptionMessage {
  USERNAME_IN_USE = 'Username in use.',
  NO_PERMISSION = 'User does not have permission to do this.'
}

export enum CustomerExceptionMessage {
  NOT_FOUND = 'Customer not found.',
  NAME_IN_USE = 'Customer name in use.',
}

export enum MeetingsExceptionMessage {
  NOT_FOUND = 'Meeting not found.',
  OUT_OF_CAPACITY = 'Number of participants greater than the room capacity.',
  INCOMPATIBLE_TIME = 'Impossible to schedule this meeting time.',
  USERS_NOT_FOUND = 'One or more users not found.'
}

export enum RepresentativesExceptionMessage {
  NOT_FOUND = 'Representative not found.',
  USERNAME_IN_USE = 'Username in use.'
}

export enum RoomsExceptionMessage {
  NOT_FOUND = 'Room not found.',
  NAME_IN_USE = 'Room name in use.'
}