export class Cache {
  constructor (idGenerator, onNewValue) {
    this.cache = {}
    this.idGenerator = idGenerator
    this.onNewValue = onNewValue
  }

  addValue (key, value) {
    const cached = this.cache[key]

    if (cached) {
      return cached
    }

    const id = this.idGenerator.next ()

    this.cache[key] = id
    this.onNewValue (this, id, value)

    return id
  }
}

export class MultiCache {
  constructor (idGenerator, onNewCache, onNewValue) {
    this.caches = {}
    this.idGenerator = idGenerator
    this.onNewCache = onNewCache
    this.onNewValue = onNewValue
  }

  getCache (key) {
    if (!this.caches[key]) {
      const cache = new Cache (this.idGenerator, this.onNewValue)

      cache.key = key
      this.caches[key] = cache
      this.onNewCache (key, cache)
    }

    return this.caches[key]
  }
}
