jQuery(document).ready(function() {

    $(".chat-list a").click(function() {
        alert("test");
        $(".chatbox").addClass('showbox');
        return false;
    });

    $(".chat-icon").click(function() {
        $(".chatbox").removeClass('showbox');
    });


});