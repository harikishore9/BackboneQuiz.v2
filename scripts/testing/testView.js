( function() {"use strict";
        /*jslint nomen: true*/
        /*global define,test,equal,module*/
        define(['model', 'view', 'util', 'jQuery', 'modelJSON'],
        /**
         * @author harik
         * @module TestView
         */
        function(Model, View, Util, $, MockQuestions) {
            $("#testframe").contents().html("<h1>IFrame</h1>");
            module("com.imaginea.quiz.view.ViewTest", {
                setup : function() {
                    $("#testframe").contents().html("<body><h1>Sample Content</body>");
                    this.el = $("#testframe").contents().find('body').eq(0);

                    this.homeView = new View.HomeView({
                        el : this.el
                    });

                    this.quizView = new View.QuizView({
                        el : this.el,
                        scoreModel : new Model.ScoreModel(),
                        collection : new Model.QuestionCollection()
                    });

                    //MockQuestions.randomized = false;
                    this.quizView.options.collection.parse(MockQuestions);

                    this.scoreView = new View.ScoreView({
                        el : this.el,
                        model : new Model.ScoreModel(),
                        collection : new Model.QuestionCollection()
                    });

                    Util.log("info:Inside the Test Router setup");
                },
                teardown : function() {
                    this.homeView = null;
                    this.quizView = null;
                    this.scoreView = null;
                    Util.log("Inside the Test Router teardown");
                }
            });

            test("Home View", 2, function() {
                var el = this.homeView.render().el;
                equal($(el).find(":input[type='text']").length, 1, "Text box rendered properly")
                equal($(el).find("button").length, 2, "Buttons rendered properly");
            });

            test("Quiz View @ Local", function() {
                expect(3);
                MockQuestions.randomized = false;
                this.quizView.options.collection.parse(MockQuestions);
                var el = this.quizView.render().el;
                equal($(el).find(".question_idx").length, 1, "Question Index Element rendered");
                equal($(el).find(".question_idx").eq(0).html().trim(), "Questions Listing :1/10", "Question Index displayed");
                equal($(el).find(".options").length, 2, "Options Displayed");
            });

            test("Quiz Questions Complete", 1, function() {
                var el, qn, len;
                this.quizView.options.collection.resetCursor();
                for ( qn = 0, len = this.quizView.options.collection.size(); qn < len; qn++) {
                    el = this.quizView.render().el;
                }
                notEqual($(el).find("#finish").eq(0).css('display'), 'none', "Quiz is Finished and score has to be generated");
            });

            test("Score View", 2, function() {
                var answers, el, score;
                answers = {
                    "Answer_1" : "Some Value",
                    "Answer_3" : "Some Value",
                    "Answer_9" : "Data Value"
                };
                this.scoreView.model.save(answers, {
                    success : function(model, xhr, options) {
                        alert(xhr);
                    },
                    error : function(model, xhr, options) {
                        alert("Error : " + xhr);
                    }
                });
                el = this.scoreView.render().el;
                score = $(el).find(".total_score").eq(0).html().match(/\d+/g);
                ok(score && score.length > 0, "Score generated");
                equal(parseInt(score[0]), 6, "Score View rendered properly");
            });

            /*test('Quiz View @ Server', 3, function() {
             stop();
             this.quizView.options.collection.fetch({
             success : function(collection, response, options) {
             var view = options.context;
             el = view.render().el;
             equal($(el).find(".question_idx").length, 1, "Question Index Element rendered");
             equal($(el).find(".question_idx").html().trim(), "Questions Listing :1/10", "Question Index displayed");
             equal($(el).find(".options").length, 5, "Options Displayed");
             start();
             },
             context : this.quizView
             });
             });*/

        });
        // End of define function...
    }());
// End of IIFE
