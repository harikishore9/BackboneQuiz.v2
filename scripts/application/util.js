( function() {"use strict";
        /*global define*/
        define(
        /**
         * @author harik
         * @module Util
         */
        function() {
            var exports = {
                /**
                 * @desc  Holds the constants required for the application
                 * @example
                 * Util.QuizConstants.OPTION_TYPE
                 * @field module:Util#QuizConstants
                 */
                QuizConstants : {
                    OPTION_TYPE : 'options',
                    FILLIN_TYPE : 'fillin',
                    HIGH_TRANSPARENCY : "rgba(255,255,255,0.15)",
                    LOW_TRANSPARENCY : "rgba(255,255,255,0.5)",
                    DEFAULT_DURATION : 60, // 60 seconds
                    ONE_SECOND : 1000,
                    DECIMAL_RADIX : 10
                },
                /**
                 * @desc Common method across browsers to handle the debug messages
                 * @example
                 * Util.log("Debug message")
                 * @method module:Util#log
                 * @param {String} message Debug message to be logged
                 */
                log : function(message) {
                    var date = new Date(),methodName;
                    methodName = date.getDate().toString() + "-" + (date.getMonth() +1).toString() + "-" +  date.getFullYear();
                    if ( typeof console != "undefined") {
                        var msg = message.split(":"), method = msg.length > 1 ? msg[0].toLowerCase() : "info";
                        if (console[method]) {
                            console[method](methodName + " >> " + msg[1]);
                        } else {
                            console.info(methodName + " >> " + msg[0]);
                        }
                    } else {
                        window.status = methodName + ">> " + message;
                    }
                },
                /**
                 * @desc Prefix the character(s) to the given string till the specified length
                 * @method module:Util#padString
                 * @example
                 * Util.padString(timeinSeconds,'0',2);
                 * @param {Object} stringToPad String to pad characters
                 * @param {Object} padChar Character to be padded with the string
                 * @param {Object} requiredLen Desired length of the string after padding...
                 * @returns {String} String with padded characters
                 */
                padString : function(stringToPad, padChar, requiredLen) {
                    stringToPad = stringToPad.toString();
                    padChar = padChar.toString();
                    var strLen = stringToPad.length + padChar.length;
                    while (strLen < requiredLen) {
                        padChar += padChar;
                    }
                    return padChar.substr(0, requiredLen - stringToPad.length) + stringToPad;
                },
                /**
                 * @desc Creates a namesapce for modular applications
                 * @method module:Util#createNameSpace
                 * @example
                 * Util.createNameSpace("com.imaginea.quiz");
                 * @param {Object} nameSpace Namespace to be created
                 * @returns {NameSpace} object
                 */
                createNameSpace : function(nameSpace) {
                    var nsArray = nameSpace.split('.'), nsItem, length, context, currentNS;
                    currentNS = '';
                    context = window;
                    for ( nsItem = 0, length = nsArray.length; nsItem < length; nsItem += 1) {
                        currentNS = nsArray[nsItem];
                        context[currentNS] = context[currentNS] || {};
                        context = context[currentNS];
                    }
                    return context;
                },
                /**
                 * @desc Returns the list of the methods available in the given object
                 * @method module:Util#showMethods
                 * @example
                 * Util.showMethods(window)
                 * @param {Object} context Object to display methods
                 * @returns {String} Line separated method names
                 */
                showMethods : function(context) {
                    return this.showProperties(context, true);
                },
                /**
                 * @desc Returns the list of the properties available in the given object
                 * @method module:Util#showProperties
                 * @example
                 * Util.showMethods(com.imaginea.quiz.Model)
                 * @param {Object} context Object to display properties
                 * @returns {String} Line separated property names
                 */
                showProperties : function(context, showMethodsOnly) {
                    var props = [], key, object, condition
                    if (Object.getPrototypeOf !== undefined) {
                        object = Object.getPrototypeOf(context);
                        for (key in object) {
                            if (object.hasOwnProperty(key)) {
                                condition = showMethodsOnly ? key.constructor === Function : key.constructor !== Function;
                                if (condition) {
                                    props.push(key);
                                }
                            }
                        }
                    }
                    return props.join("\n");
                }
            };
            return exports;
        });
        // End for define method
    }());
// End for IIFE
