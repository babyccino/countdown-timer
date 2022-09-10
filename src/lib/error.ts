export default class ServerError extends Error {
	protected _status: number
	get status(): number {
		return this._status
	}

	constructor(
		message: string,
		status: number = 500,
		errorOptions?: ErrorOptions
	) {
		super(message, errorOptions)
		this._status = status
	}
}
