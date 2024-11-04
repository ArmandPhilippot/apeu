export class MissingSlotError extends Error {
  constructor(slot: string) {
    super(`A ${slot} slot is required.`);
  }
}
