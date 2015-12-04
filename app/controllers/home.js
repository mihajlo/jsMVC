//home controller
var home = {

    run: function () {
        fw.load.view('home');
        fw.load.model('example');
        $(window).load(function () {
            fw.view.home.show(function () {
                fw.load.helper('date'); //function from PHPjs
                var currentTime = date('H:i:s'); //like in PHP
                $('[label="time"]').html(currentTime);
            });
        });

    }
}
