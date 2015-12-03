var home = {
    show: function (callback) {
        $.get('themes/default/home.html', function (htmlData) {
            $('#wrap').html(htmlData);
            if (callback) {
                callback();
            }
        });
    }
};
