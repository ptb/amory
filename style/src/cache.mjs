export default ((store) => (media = "") => {
  if (!store.has (media)) {
    store.set (media, new Map ())
  }

  return (key, { id, rule } = {}) => {
    if (key && !id) {
      return store.get (media).get (key)
    }

    if (id) {
      store.get (media).set (key, { id, rule })

      return id
    }

    return store
  }
}) (new Map ())
