( function() {"use strict";
        /*jslint nomen: true*/
        /*global define,test,equal,module*/
        define(['model', 'util', 'modelJSON'],
        /**
         * @author harik
         * @module TestModel
         */
        function(Model, Util, MockQuestions) {
            module("com.imaginea.quiz.model.ModelTest", {
                setup : function() {
                    this.collection = new Model.QuestionCollection();
                    this.collection.reset();
                    Util.log("Inside the Test Model setup");
                },
                teardown : function() {
                    this.collection = null;
                    Util.log("Inside the Test Model teardown");
                }
            });

            test("Empty Model", 1, function() {
                equal(this.collection.size(), 0, "Model is Empty");
            });

            test("Load Models", 1, function() {
                this.collection.parse(MockQuestions);
                equal(this.collection.size(), 10, "Collection is loaded with models");
            });

            test("Navigate Model", 1, function() {
                this.collection.parse(MockQuestions);
                var model = this.collection.next();
                equal(this.collection.getCursor(), 0, "Navigation is working...");
            });

            test("Navigation First Item", 1, function() {
                MockQuestions.randomized = false;
                this.collection.parse(MockQuestions);
                var question = MockQuestions.questions[0].question;
                equal(this.collection.first().get("question"), question, "First Question retrieved properly");
            });

            asyncTest("Populate Model", 2, function() {
                this.collection.url = '/BackboneQuiz/model/model.json';
                this.collection.reset();
                this.collection.fetch({
                    success : function(collection, response, options) {
                        var models = options.context;
                        equal(models.size(), 10, "Collection is loaded with models");

                        var model = models.next();
                        equal(models.getCursor(), 0, "Navigation is working...");

                        start();
                    },
                    context : this.collection
                });
            });

            asyncTest("Populate Invalid Model", 1, function() {
                this.collection.reset();
                this.collection.url = 'temp.json';
                this.collection.fetch({
                    success : function(collection, response, options) {
                        option.context.reset();
                        options.context.update(collection.models, {
                            merge : false
                        });
                    },
                    error : function(collection) {
                        equal(collection.size(), 0, "Unable to load the model from the URL");
                        start();
                    },
                    context : this.collection
                });
            });
        });
        // End of define function...
    }());
// End of IIFE
