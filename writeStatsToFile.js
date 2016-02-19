
const path = require('path')
const fs = require("fs")
const gulp = require("gulp")
require('./gulpfile')

module.exports = function writeStatsToFile () {
  this.plugin("done", function(stats) {
    fs.writeFileSync(
      path.join(__dirname, "/public/app/", "stats.json"),
      JSON.stringify({hash: stats.hash}))

    gulp.start('oss')
  })
}

