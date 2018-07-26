module.exports = {
  "module": {
    "rules": [
      {
        "test": /\.(gif|jpe?g|png|webp)$/,
        "use": [
          {
            "loader": "@amory/picture"
          }
        ]
      }
    ]
  },
  "name": "@amory/picture"
}
