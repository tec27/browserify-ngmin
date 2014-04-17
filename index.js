var ngmin = require('ngmin')
  , through = require('through')

module.exports = function(file) {
  if(!/\.(js|coffee)$/i.test(file)) return through();

  var buffered = ''

  function write(data) {
    buffered += data
  }

  function end() {
    if(/angular\.module/.test(buffered)) {
      try {
        buffered = ngmin.annotate(buffered)
      } catch (err) {
        this.emit('error', err)
      }
    }

    this.queue(buffered)
    this.queue(null)
  }

  return through(write, end)
}
