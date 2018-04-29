const { slide } = require ("./index.json")

module.exports = {
  "slide": {
    "back": {
      "exit": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animationName": slide[5]
      },
      "next": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animationName": slide[6]
        },
        "animationName": slide[7]
      }
    },
    "fore": {
      "exit": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animationName": slide[8]
        },
        "animationName": slide[9]
      },
      "next": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animationName": slide[10]
      }
    }
  }
}
