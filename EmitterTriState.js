const _ = require('underscore');
const Q = require('q');
const path = require('path');
const exec = require('child_process').exec;
const util = require('util');


module.exports = EmitterTriState;



EmitterTriState.SCRIPT = 'build/codesend';

function EmitterTriState(options) {
    this.options = options;
}

/**
 * Send a decimal code through 433Mhz (and return a promise).
 *
 * @param   code        TriState code
 * @param   [options]   Options to configure pin or pulseLength
 *                      options.pin           Pin on which send the code
 *                      options.pulseLength   Pulse length
 * @param   [callback]  Callback(error, stdout)
 * @return  Promise
 */
EmitterTriState.prototype.sendCode = function(code, options, callback) {

    var deferred = Q.defer();

    //NoOp as default callback
    if (!_.isFunction(callback)) {
        callback = _.noop;
    }

    //Check arguments length
    if (arguments.length === 0 || arguments.length > 3) {
        return deferred.reject(new Error('Invalid parameters. sendCode(code, [options, callback])'));
    }


    //Tidy up
    switch (arguments.length) {

        //function(code)
        case 1:

            options = this.options;

            break;

            //function(code, options || callback)
        case 2:

            //function(code, callback)
            if (_.isFunction(options)) {

                callback = options;
                options = this.options;

                //function(code, options)
            } else if (_.isObject(options)) {

                _.defaults(options, this.options);

                //function(code, ???)
            } else {

                return deferred.reject(new Error('Second parameter must be a function (callback) or an object (options)'));

            }

            break;

            //function(code, options, callback)
        default:

            _.defaults(options, this.options);

            break;

    }

    //Send the code
    exec([path.join(__dirname, EmitterTriState.SCRIPT),
        '--pin', options.pin,
        '--pulse-length', options.pulseLength,
        '--tri-state', code
    ].join(' '), function(error, stdout, stderr) {

        error = error || stderr;

        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(stdout);
        }

        callback(error, stdout);

    });

    return deferred.promise;

};
