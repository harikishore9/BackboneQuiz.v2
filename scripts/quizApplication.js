( function() {"use strict";
        /*global define*/
        define(["router"],
        /**
         * @author harik
         * @module ApplicationLoader
         * @desc Defines the Router configuration
         * @param {Object} Router
         */
        function(Router) {
            var exports = {
                /**
                 * @desc Initializes the router object to navigate the views
                 * @method module:ApplicationLoader#init
                 */
                init : function() {
                    if (Router.QuizRouter) {
                        var router = new Router.QuizRouter();
                    }
                }
            };
            return exports;
        });
        // End for define method
    }());
// End for IIFE

