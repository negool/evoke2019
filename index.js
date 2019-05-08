$("#getMeetingBtn").on("click", function() {
    $("#spinner").removeClass("hidden");

    $.ajax({
        url: '/test',
        complete: function(data) {
            const element = $("#listElements");
            element.html("");
            $.each(data.responseJSON.message, function(index, value) {
                const html = "<li class='list-group-item'>" + value + "</li>"
                setTimeout(function() {
                    element.append(html);
                    $("#spinner").addClass("hidden");
                }, 2200);
            })
        },
        error: function() {
            $("#spinner").addClass("hidden");
        }
    });
});