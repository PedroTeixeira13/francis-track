export class RepresentativeFoundError extends Error {
  constructor() {
    super('Username in use');
  }
}
