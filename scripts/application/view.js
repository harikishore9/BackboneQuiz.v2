( function() {"use strict";
        /*jslint nomen: true*/
        /*jslint plusplus: true */
        /*global Backbone, Application, _, define,Require*/
        define(
        /**
         * @author harik
         * @module View
         */
        function(require) {
            var exports = {}, HomeViewTemplate, QuizViewTemplate, ScoreViewTemplate, $, _, Backbone, Util, Mixin;
            //Load Libraries
            $ = require("jQuery");
            _ = require("underscore");
            Backbone = require("backbone");
            //Load Application classes
            Util = require("util");
            Mixin = require("mixin");
            // Load HTML Templates...
            HomeViewTemplate = $("#index_template").html();
            //require("text!../views/indexView.html");
            QuizViewTemplate = $("#quiz_template").html();
            //require("text!../views/quizView.html");
            ScoreViewTemplate = $("#score_template").html();
            //require("text!../views/scoreView.html");
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @requires Mixin
             @requires HomeViewTemplate
             @augments module:Backbone.View
             */
            exports.HomeView = Backbone.View.extend(
            /**
             @lends module:View~HomeView.prototype
             */
            {
                el : $('body'),
                events : {
                    "click #start" : "showHome",
                    "click #help" : "showHelp"
                },
                showHome : function() {
                    window.location.hash = "#quiz";
                },
                showHelp : function() {
                    alert("Help not available");
                },
                template : _.template(HomeViewTemplate), // _.template($("#index_template").html())
                initialize : function() {
                    _.extend(exports.HomeView.prototype, Mixin.AnimationMixin);
                },
                render : function() {

                    $(this.el).html(this.template());
                    this.buttonHover(":button");
                    return this;
                }
            });
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @requires Mixin
             @requires ScoreViewTemplate
             @augments module:Backbone.View
             */
            exports.ScoreView = Backbone.View.extend(
            /**
             @lends module:View~ScoreView.prototype
             */
            {
                el : $('body'),
                template : _.template(ScoreViewTemplate),
                events : {
                    "click .restart" : "restart",
                    "click .newgame" : "restart"
                },
                initialize : function() {
                    _.extend(exports.ScoreView.prototype, Mixin.AnimationMixin);
                },
                restart : function() {
                    window.location.hash = "#restart";
                },
                render : function() {
                    var attemptedQuestions = 0, data, totalQuestions, keyPrefix, key, keySize;
                    data = JSON.parse(JSON.stringify(this.model));
                    totalQuestions = this.collection.size();
                    keyPrefix = "Answer_";
                    for ( key = 0; key < totalQuestions; key += 1) {
                        if (data[keyPrefix + key]) {
                            attemptedQuestions++;
                        }
                    };
                    this.model.save({
                        totalQuestions : totalQuestions,
                        attempted : attemptedQuestions,
                        score : attemptedQuestions * 2
                    }, {
                        success : function(model, response, options) {
                            //server must return a JSON object.
                            //this callback will not fire provided the response is not a JSON object
                            window.status = "Invoking sync...";
                        }
                    });
                    $(this.el).html(this.template(this.model.toJSON()));
                    this.buttonHover();
                    this.linkHover();
                    return this;
                }
            });
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @requires Mixin
             @augments module:Backbone.View
             */
            exports.TimerView = Backbone.View.extend(
            /**
             @lends module:View~TimerView.prototype
             */
            {
                duration : Util.QuizConstants.DEFAULT_DURATION,
                initialize : function() {
                    _.extend(exports.TimerView.prototype, Mixin.TimerMixin);
                    this.duration = this.options.interval;
                    this.bind("timedOut", this.options.timedOutCallback, this.options.parentView);
                },
                start : function() {
                    if (this.duration > 0) {
                        $(".time_left").html("00:" + Util.padString(this.duration, 0, 2));
                        this.duration--;
                    } else {
                        this.trigger("timedOut");
                    }
                    this.timer = setTimeout( function(context) {
                        return function() {
                            context.start();
                        }
                    }(this), Util.QuizConstants.ONE_SECOND);
                },
                isRunning : function() {
                    return Boolean(this.timer && this.timer.constructor === Number);
                },
                stop : function(restart) {
                    this.reset();
                    if (this.timer) {
                        window.clearTimeout(this.timer);
                        this.timer = null;
                    }
                    if (restart == true) {
                        this.start();
                    }
                },
                reset : function() {
                    this.duration = this.options.interval;
                },
                resetView : function() {
                    this.unbind();
                    this.undelegateEvents();
                    this.stop();
                }
            });
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @requires Mixin
             @requires QuizViewTemplate
             @augments module:Backbone.View
             */
            exports.QuizView = Backbone.View.extend(
            /**
             @lends module:View~TimerView.prototype
             */
            {
                el : $('body'),
                template : _.template(QuizViewTemplate),
                initialize : function(options) {
                    var radix = Util.QuizConstants.DECIMAL_RADIX, duration = parseInt(this.collection.getProperty("duration"), radix) / this.collection.size();
                    _.extend(exports.QuizView.prototype, Mixin.AnimationMixin);
                    this.timer = new exports.TimerView({
                        interval : duration,
                        parentView : this,
                        timedOutCallback : this.showNext
                    });
                    this.bind("oncomplete", this.showScore);
                },
                resetView : function() {
                    // Reset Sub view
                    this.timer.resetView();
                    // Reset current view
                    this.unbind();
                    this.undelegateEvents();
                    //Reset Nested model...
                    this.options.scoreModel.clear();
                    //Reset the collection ob
                    this.collection.resetCursor();
                },
                render : function() {
                    var context = arguments.length > 0 ? arguments[0] : this, collection = context.collection;
                    if (collection && !collection.isEmpty()) {
                        context.model = collection.next();
                        document.title = context.collection.getProperty("title");
                        if (collection.getCursor() < collection.size()) {
                            context.model.save({
                                count : (collection.getCursor() + 1),
                                recordCount : collection.size()
                            });
                            $(context.el).html(context.template(context.model.toJSON()));
                        } else {
                            context.trigger("oncomplete");
                        }
                        $("#next_question").css("display", collection.isLast() ? "none" : "block");
                        $("#finish").css("display", collection.isLast() ? "block" : "none");
                        $("#next_question").attr("disabled", "disabled");
                        context.buttonHover();
                        context.linkHover();
                    }
                    return context;
                },
                events : {
                    "click #next_question" : "showNext",
                    "click #finish" : "showScore",
                    "click .options" : "mapAnswer",
                    "blur .fillin" : "mapAnswer",
                    "change .fillin" : "mapAnswer"
                },
                showNext : function() {
                    this.timer.reset();
                    this.render();
                    var isTimerBased = !isNaN(this.collection.getProperty("duration"));
                    if (isTimerBased && !this.timer.isRunning()) {
                        this.timer.start();
                    }
                },
                showScore : function() {
                    this.timer.stop();
                    window.location.hash = "#score";
                },
                mapAnswer : function(eventObj) {
                    var srcElement = eventObj.target, element = this.options.scoreModel.toJSON(), keyPrefix = "Answer_";
                    if ($(srcElement).hasClass(Util.QuizConstants.FILLIN_TYPE)) {
                        element[keyPrefix + this.collection.getCursor()] = $(srcElement).val();
                    } else {
                        this.showAsSelected(srcElement, $(".options"));
                        element[keyPrefix + this.collection.getCursor()] = $(srcElement).html();
                    }
                    this.options.scoreModel.save(element);
                    $("#next_question").removeAttr("disabled");
                }
            });
            return exports;
        });
        // End of define function...
    }());
// End of IIFE