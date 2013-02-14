( function() {"use strict";
        /*jslint nomen: true*/
        /*jslint plusplus: true */
        /*global Backbone, Application, _, $, define*/
        define(['jQuery', 'underscore', 'backbone', 'model', 'view'],
        /**
         * @author harik
         * @module Router
         */
        function($, _, Backbone, Model, View) {
            var exports = {};
            /**
             @constructor
             @requires $
             @requires _
             @requires Backbone
             @requires Model
             @requires View
             @augments module:Backbone.Router
             */
            exports.QuizRouter = Backbone.Router.extend(
            
            {
                routes : {
                    "" : "showHome",
                    "home" : "showHome",
                    "score" : "showScore",
                    "quiz" : "showQuiz",
                    "restart" : "restart",
                    "newgame" : "restart",
                    "skip/:idx/:answer/:weight" : "skipQuestion"
                },
                /**
                 * @desc Inits the Router navigation
                 * @method module:Router#initialize
                 */
                initialize : function() {
                    this.questionCollection = new Model.QuestionCollection();
                    this.scoreModel = new Model.ScoreModel();
                    Backbone.history.start();
                },
                /**
                 * @desc Navigates to the home view
                 * @method module:Router#showHome
                 */
                showHome : function() {
                    this.homeView = new View.HomeView({
                        model : {}
                    });
                    this.homeView.render();
                },
                /**
                 * @desc Navigates to the Quiz view
                 * @method module:Router#showQuiz
                 */
                showQuiz : function() {
                    this.quizView = new View.QuizView({
                        scoreModel : this.scoreModel,
                        collection : this.questionCollection
                    });
                    this.quizView.showNext();
                },
                /**
                 * @desc Restarts the quiz view
                 * @method module:Router#restart
                 */
                restart : function() {
                    this.quizView.resetView();
                    this.navigate("#quiz", {
                        trigger : true
                    });
                },
                /**
                 * @desc Navigates to the next question
                 * @method module:Router#skipQuestion
                 * @param {Number} idx     Current Question Index
                 * @param {Number} answer  Current Question Answer Value
                 * @param {Number} weight  Current Question Weightage
                 */
                skipQuestion : function(idx, answer, weight) {
                    if (this.quizView) {
                        this.quizView.showNext();
                    }
                    // Do any processing wih idx , answer ,weight for any negative marking....
                },
                /**
                 * @desc Generates the score view
                 * @method module:Router#showScore
                 */
                showScore : function() {
                    this.scoreView = new View.ScoreView({
                        model : this.scoreModel,
                        collection : this.questionCollection
                    });
                    this.scoreView.render();
                }
            });
            return exports;
        });
        // End of define function...
    }());
// End of IIFE
