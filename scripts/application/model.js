( function() {"use strict";
        /*jslint nomen: true*/
        /*global Backbone, Application, _, define*/
        define(['jQuery', 'underscore', 'backbone', 'mixin', 'util','modelJSON'],
        /**
         * @author harik
         * @module Model
         */
        function($, _, Backbone, Mixin, Util,Questions) {
            var exports = {};
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Mixin
             @requires Util
             @augments module:Backbone.Model
             */
            exports.QuestionModel = Backbone.Model.extend(
            /**
             @lends module:Model~QuestionModel.prototype
             */
            {
                sync : function(method, model, options) {
                    // Overriding this method to prevent making server request..
                    // if not over-ridden, URL property is required...
                    Util.log("info:Inside sync method of Question Model");
                }
            });
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Mixin
             @requires Util
             @augments module:Backbone.Model
             */
            exports.ScoreModel = Backbone.Model.extend(
            /**
             @lends module:Model~ScoreModel.prototype
             */
            {
                sync : function(method, model, options) {
                    // Override this method to save to local as there is no db..
                    Util.log("info:Inside sync method of Score Model");
                }
            });
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Mixin
             @requires Util
             @augments module:Backbone.Model
             */
            exports.QuestionCollection = Backbone.Collection.extend(
            /**
             @lends module:Model~QuestionCollection.prototype
             */
            {
                model : exports.QuestionModel,
                url : '/BackboneQuiz/model/model.json',
                parse : function(response) {
                    //alert("Response >> " + response)
                    this.reset();
                    var questions = response.questions, qnIdx, len;
                    // Empty the collection with the loaded model
                    // we loaded the response....
                    for ( qnIdx = 0, len = questions.length; qnIdx < len; qnIdx += 1) {
                        this.create({
                            properties : {
                                randomized : response.randomized,
                                title : response.title,
                                duration : response.time
                            },
                            question : questions[qnIdx].question,
                            answers : questions[qnIdx].answers,
                            weight : questions[qnIdx].weight,
                            type : questions[qnIdx].type,
                            image : questions[qnIdx].imageURL
                        });
                    }
                    this.shuffle();
                    return this.models;
                },
                fetchCallback : {
                    success : function(collection, response, options) {
                        Util.log("info:Model >> QuestionCollection >> " + response);
                    },
                    error : function(collection, xhr, options) {
                        Util.log("warn:Model >> QuestionCollection >> Loading data from questions.js");
                        collection.parse(Questions);                        
                    }
                },
                initialize : function(options) {
                    _.extend(exports.QuestionCollection.prototype, Mixin.CollectionMixin);
                    this.fetch(this.fetchCallback);
                }
            });
            return exports;
        });
        // End of define function...
    }());
// End of IIFE
