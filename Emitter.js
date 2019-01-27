const _ = require('underscore')
const Q = require('q')
const path = require('path')
const exec = require('child_process').exec

module.exports = Emitter;

Emitter.SCRIPT = 'build/codesend'

function Emitter(options) {
    this.opts = options
}

/**
 * Send a decimal code through 433Mhz (and return a promise).
 *
 * @param   code        Decimal code
 * @param   [options]   Options to configure pin or pulseLength
 *                      options.pin           Pin on which send the code
 *                      options.pulseLength   Pulse length
 * @param   [callback]  Callback(error, stdout)
 * @return  Promise
 */
Emitter.prototype.sendCode = function(code, options, callback) {
    var deferred = Q.defer()

    //Check arguments length
    if (arguments.length === 0 || arguments.length > 3) {
        return deferred.reject(new Error('Invalid parameters. sendCode(code, [options, callback])'))
    }

    //Check if code is a number (and parse it)
    code = parseInt(code)
    if (typeof(code) !== 'number'){
        return deferred.reject(new Error('First parameter must be a integer'))
    }

    switch (arguments.length) {
        //function(code)
        case 1:
            options = this.options;
            break

            //  function(code, options || callback)
        case 2:
            //  function(code, callback)
            if (typeof(options) === 'function') {
                callback = options
                options = this.options

            //  function(code, ???)
            } else if (typeof(options) !== 'object') {
                return deferred.reject(new Error('Second parameter must be a function (callback) or an object (options)'))
            }
            break
            //  function(code, options, callback)
        default:
            if(!options){
                options = this.opts
            }
            break
    }

    //  Send the code
    exec([path.join(__dirname, Emitter.SCRIPT),
        '--code', code,
        '--pin', options.pin,
        '--pulse-length', options.pulseLength
    ].join(' '), function(error, stdout, stderr) {
        error = error || stderr
        if (error) {
            deferred.reject(error)
        } else {
            deferred.resolve(stdout)
        }
        callback(error, stdout)
    })
    return deferred.promise;
}
