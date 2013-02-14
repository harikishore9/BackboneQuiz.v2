( function() {"use strict";
        /*jslint nomen: true*/
        /*jslint plusplus: true */
        /*global Backbone, Application, _, $, define*/
        define(['jQuery', 'underscore', 'backbone', 'util'],
        /**
         * @author harik
         * @module Mixin
         */
        function($, _, Backbone, Util) {
            var exports = {};
            /**
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @augments module:Backbone.Model
             */
            exports.AnimationMixin = {
                /**
                 * @desc  Selects the given element
                 * @example
                 * AnimationMixin.showAsSelected($('#el'),$('.options'))
                 * @method module:Mixin#showAsSelected
                 * @param {HTMLDOMElement} element HTML Element
                 * @param {HTMLDOMElementCollection} controlArray Selector that matches more than one element
                 */
                showAsSelected : function(element, controlArraySelector) {
                    if (controlArraySelector) {
                        $(controlArraySelector).each(function() {
                            $(this).css("background", Util.QuizConstants.HIGH_TRANSPARENCY);
                            if ($(this).find("span")) {
                                $(this).children().eq(0).remove();
                            }
                        });
                    }
                    $(element).css("background", Util.QuizConstants.LOW_TRANSPARENCY);
                    $(element).prepend("<span class='selected_item'>&#10003;</span>");
                },
                /**
                 * @desc Applies the Hover effect for the links
                 * @example
                 * AnimationMixin.linkHover()
                 * @method module:Mixin#linkHover
                 */
                linkHover : function() {
                    $("a[class!='options']").hover(function() {
                        $(this).fadeTo(350, 0.5);
                        $(this).fadeTo(350, 1.0);
                    });
                },
                /**
                 * @desc Applies the Hover effect for the buttons
                 * @example
                 * AnimationMixin.buttonHover()
                 * @method module:Mixin#buttonHover
                 */
                buttonHover : function() {
                    $(":button").mouseenter(function() {
                        $(this).fadeTo(350, 0.5);
                    }).mouseleave(function() {
                        $(this).fadeTo(350, 1.0);
                    });
                }
            };
            /**
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @augments module:Backbone.Model
             */
            exports.CollectionMixin = {
                _cursor : -1,
                /**
                 * @desc Resets the cursor in the collection list...
                 * @example
                 * CollectionMixin.resetCursor()
                 * @method module:Mixin#resetCursor
                 */
                resetCursor : function() {
                    this.shuffle();
                    this._cursor = -1;
                },
                /**
                 * @desc Returns the current cursor position during the traversal
                 * @example
                 * CollectionMixin.getCursor()
                 * @method module:Mixin#getCursor
                 * @returns {Number} cursor position
                 */
                getCursor : function() {
                    return this._cursor;
                },
                /**
                 * @desc Returns the next item in the collection from the cursor position
                 * @method module:Mixin#next
                 * @example
                 * CollectionMixin.next()
                 * @returns {Model.QuestionModel} Question Model
                 */
                next : function() {
                    var item = null;
                    if (!this.isEmpty() && this.getCursor() < this.size()) {
                        item = this.models[++this._cursor];
                    }
                    return item;
                },
                /**
                 * @desc Returns the previous item in the collection from the cursor position
                 * @method module:Mixin#previous
                 * @example
                 * CollectionMixin.previous()
                 * @returns {Model.QuestionModel} Question Model
                 */
                previous : function() {
                    var item = null;
                    if (!this.isEmpty() && this.getCursor() > this.size()) {
                        item = this.models[--this._cursor];
                    }
                    return item;
                },
                /**
                 * @desc Returns the first item in the collection
                 * @method module:Mixin#first
                 * @example
                 * CollectionMixin.first()
                 * @returns {Model.QuestionModel} Question Model
                 */
                first : function() {
                    var item = null;
                    if (!this.isEmpty()) {
                        item = this.models[0];
                    }
                    return item;
                },
                /**
                 * @desc Returns the first item in the collection
                 * @method module:Mixin#last
                 * @example
                 * CollectionMixin.last()
                 * @returns {Model.QuestionModel} Question Model
                 */
                last : function() {
                    var item = null;
                    if (!this.isEmpty()) {
                        item = this.models[this.size() - 1];
                    }
                    return item;
                },
                /**
                 * @desc Returns the boolean value to indicate the items availability in the collection
                 * @method module:Mixin#isEmpty
                 * @example
                 * CollectionMixin.isEmpty()
                 * @returns {Boolean} Boolean value
                 */
                isEmpty : function() {
                    return this.models.length === 0;
                },
                /**
                 * @desc Returns the property value for the given key in the model of the collection
                 * @method module:Mixin#getProperty
                 * @example
                 * CollectionMixin.getProperty("time")
                 * @param {String} key Key in the Model
                 * @returns {Boolean} Boolean value
                 */
                getProperty : function(key,index) {
                    var property = null, index = index || 0;
                    if (!this.isEmpty()) {
                        property = this.models[index].get("properties")[key];
                    }
                    return property;
                },
                /**
                 * @desc Randomize the items in the collection
                 * @method module:Mixin#shuffle
                 * @example
                 * CollectionMixin.shuffle()
                 */
                shuffle : function() {
                    if (this.getProperty("randomized") === true) {
                        var modelSize = this.models.length, idx, random, change, helper, decimalRadix;
                        decimalRadix = 10;
                        random = parseInt(Math.random() * modelSize, decimalRadix);
                        for ( idx = 0; idx < modelSize; idx += 1) {
                            change = idx + parseInt(Math.random() * (modelSize - idx), decimalRadix);
                            helper = this.models[idx];
                            this.models[idx] = this.models[change];
                            this.models[change] = helper;
                        }
                    }
                },
                /**
                 * @desc Returns the size of the items in the collection
                 * @method module:Mixin#size
                 * @example
                 * CollectionMixin.size()
                 * @returns {Number} items size
                 */
                size : function() {
                    return this.models.length;
                },
                /**
                 * @desc Returns the boolean value to indicate the cursor is in the last item
                 * @method module:Mixin#isLast
                 * @example
                 * CollectionMixin.isLast()
                 * @returns {Boolean} Boolean value
                 */
                isLast : function() {
                    return (this.getCursor() === (this.size() - 1));
                }
            };
            /**
             @requires $
             @requires _
             @requires Backbone
             @requires Util
             @augments module:Backbone.Model
             */
            exports.TimerMixin = {
                /**
                 * @desc Timer initialization configuration which should be invoked once
                 * @method module:Mixin#initTimer
                 * @example
                 * var myobj = new Myobj();
                 * TimerMixin.initTimer(1000,true,myobj,myobj.callback);
                 * @param {Object} interval Timer Interval
                 * @param {Object} repeat Repeat the callback action
                 * @param {Object} context Context the timer callback should use
                 * @param {Object} callback Callback method to execute
                 */
                initTimer : function(interval, repeat, context, callback) {
                    this.inerval = interval || 15000;
                    this.repeat = repeat || true;
                    this.context = context || window;
                    this.callback = callback;
                    this.timer = null;
                },
                /**
                 * @desc Returns the Timer type either repeat or once
                 * @method module:Mixin#getTimerType
                 * @example
                 * var myobj = new Myobj();
                 * TimerMixin.initTimer(1000,true,myobj,myobj.callback);
                 * TimerMixin.getTimerType('set'); // returns setTimeout / setInterval..
                 * @param {String} mode to identify either to set / clear
                 * @returns {String} type of the timer
                 */
                getTimerType : function(mode) {
                    var type = null;
                    if (mode && mode == 'set') {
                        type = this.repeat === true ? "setInterval" : "setTimeout";
                    } else {
                        type = this.repeat === true ? "clearInterval" : "clearTimeout";
                    }
                    return type;
                },
                /**
                 * @desc Starts the timer using the above configuration
                 * @method module:Mixin#startTimer
                 * @example
                 * var myobj = new Myobj();
                 * TimerMixin.initTimer(1000,true,myobj,myobj.callback);
                 * TimerMixn.startTimer();
                 */
                startTimer : function() {
                    this.timer = window[this.getTimerType()]( function(context, callback) {
                        return function() {
                            if (callback && callback.constructor === Function) {
                                callback(context);
                            }
                        };
                    }(this.context, this.callback), this.interval);
                },
                /**
                 * @desc Stops the timer using the above configuration
                 * @method module:Mixin#stopTimer
                 * @example
                 * var myobj = new Myobj();
                 * TimerMixin.initTimer(1000,true,myobj,myobj.callback);
                 * TimerMixn.startTimer();
                 * //..... Todo.. logic...
                 * TimerMixin.stopTimer();
                 */
                stopTimer : function() {
                    if (this.timer) {
                        window[this.getTimerType('clear')](this.timer);
                    }
                }
            };
            return exports;
        });
        // End of define function...
    }());
// End of IIFE