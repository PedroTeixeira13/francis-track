export class RepresentativeNotFoundError extends Error {
  constructor() {
    super('Representative not found');
  }
}
