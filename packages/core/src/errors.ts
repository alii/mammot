/**
 * An error that will have the message sent back to the user
 */
export class MammotError extends Error {
	/**
	 * Construct a new MammotError
	 * @param message The message to display to the user
	 * @constructor
	 */
	public constructor(message: string) {
		super(message);
	}
}
