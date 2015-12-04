//home controller
var home = {

    run: function () {
        fw.load.view('home');
        fw.load.model('example');



        $.getJSON('http://api.1mk.org/quiz/question?cid=dddd', function (rsp) {
            fw.model.example.quiz = rsp;
            $(window).load(function () {
                $('body').on('click', '.newQuestion', function () {
                    fw.controller.home.question();
                });
                fw.view.home.show(function () {
                    fw.load.helper('date'); //function from PHPjs
                    var currentTime = date('H:i:s'); //like in PHP
                    $('[label="time"]').html(currentTime);
                });
            });
        });


    },
    question: function () {
        $.getJSON('http://api.1mk.org/quiz/question?cid=dddd', function (rsp) {
            fw.model.example.quiz = rsp;
            fw.view.home.show(function () {
                var currentTime = date('H:i:s'); //like in PHP
                $('[label="time"]').html(currentTime);
            });
        });
    }
}
