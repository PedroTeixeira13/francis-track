export class CustomerFoundError extends Error {
  constructor() {
    super('Customer name in use');
  }
}
