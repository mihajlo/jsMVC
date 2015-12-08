function uri_segment(num) {
    try {
        var seg = str_replace('#', '', window.location.hash).split('/')[num - 1];
    } catch (e) {
        var seg = '';
    }
    return seg;
}
