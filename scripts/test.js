( function() {"use strict";
        /*jslint nomen: true*/
        /*global Backbone, Application, _*/
        QUnit.config.autostart = false;
        require.config(
        /**
         * @desc Bootstrap file to load the application
         * @author harik
         */
        {
            paths : {
                jQuery : "libraries/jquery-1.8.3.min",
                underscore : "libraries/underscore",
                backbone : "libraries/backbone",
                mixin : "application/mixin",
                util : "application/util",
                model : "application/model",
                view : "application/view",
                router : "application/router",
                modelJSON : 'application/questions'
            },
            /**
             * @desc Defines the module configuration which are not AMD compatible
             */
            shim : {
                'jQuery' : {
                    exports : 'jQuery'
                },
                'backbone' : {
                    deps : ['jQuery', 'underscore'],
                    exports : "Backbone"
                },
                'underscore' : {
                    exports : "_"
                }
            }
        });
        /**
         * @desc Launches the Quiz Application by loading the required dependencies
         */
        require(["testing/testView", "testing/testModel"], QUnit.start);
    }());
// End for IIFE
