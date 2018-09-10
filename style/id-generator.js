export default class {
  constructor (prefix = "") {
    this.count = 0
    this.msb = 1295
    this.offset = 374
    this.power = 2
    this.prefix = prefix
  }

  increment () {
    const id = this.count + this.offset

    if (id === this.msb) {
      this.offset += (this.msb + 1) * 9
      this.msb = Math.pow (36, ++this.power) - 1
    }

    this.count += 1

    return id
  }

  next () {
    const id = this.increment ().toString (36)

    return this.prefix ? `${this.prefix}${id}` : id
  }
}
