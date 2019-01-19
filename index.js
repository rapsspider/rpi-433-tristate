const   Sniffer = require('./Sniffer'),
        Emitter = require('./Emitter'),
        EmitterTriState = require('./EmitterTriState')

module.exports = {

  /**
   * Create an instance of the sniffer
   *
   * @param   options
   *          options.pin             The pin on which to listen codes
   *          options.debounceDelay   Delay before reading another code
   *
   * @return  Sniffer   Sniffer instance (singleton)
   */
  snifferOpts:{
    pin: 2,
    debounceDelay: 500
  },
  emitterOpts: {
    pin: 0,
    pulseLength: 350
  }, 
  
  sniffer: function (options) {
    if(!options){
      options = this.snifferOpts
    }
    return Sniffer.getInstance(options)
  },

  /**
   * Send a code through 433Mhz (and return a promise).
   *
   * @param   [options]   Options to configure pin or pulseLength
   *                      options.pin           Pin on which send the code
   *                      options.pulseLength   Pulse length
   *
   * @return  Function    Function used to send codes
   */
  emitter: function (options) {
    if(!options){
      options = this.emitterOpts
    }
    return new Emitter(options)
  },

  emitterTriState: function (options) {
    if(!options){
      options = this.emitterOpts
    }
    return new EmitterTriState(options)
  }
}
