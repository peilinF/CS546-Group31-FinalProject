(function ($) {
    var login = $("#login"),
        title = $("#title"),
        content = $("#content"),
        rating = $("#rating"),
        postReview = $("#postReview"),
        parkName = $("#park_head");
    login.click(function () {
        window.location.href = "/login";
    });
    postReview.submit(function (e) {
        e.preventDefault();
        var requestConfig = {
            method: 'POST',
            url: '/review/add',
            contentType: "application/json",
            data: JSON.stringify({
                parkName: parkName.text(),
                reviewTitle: title.val(),
                content: content.val(),
                rating: rating.val(),
            }),
            error: function (err) {
                // window.location.href = "/review/error/" + err.responseText;
                alert(err);
            },
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            window.location.href = '/park/review';
        });
    });
})(window.jQuery);