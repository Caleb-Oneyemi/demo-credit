export class SqlError extends Error {
  sql: string

  constructor(public message: string) {
    super(message)

    this.sql = message

    Object.setPrototypeOf(this, SqlError.prototype)
  }
}
