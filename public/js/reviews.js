(function ($) {
    var login = $("#login"),
        title = $("#title"),
        content = $("#content"),
        rating = $("#rating"),
        postReview = $("#postReview"),
        parkName = $("#park_head");
        review = $("#review");
        reply = $(".reply");
        like = $(".like");
        replyClass = $(".review-ui"),
        id = $(".review-id");
    if (id.is(':visible')) {
        id.hide();
    }
    login.click(function () {
        window.location.href = "/login";
    });
    postReview.submit(function (e) {
        e.preventDefault();
        if (!title.val() || !content.val() || !rating.val() || !parkName.text()) {
            review.append("<div class='error' role='alert'>Please fill all the fields</div>");
            return;
        } else if (rating.val() < 1 || rating.val() > 5) {
            review.append("<div class='error' role='alert'>Rating should be between 1 and 5</div>");
            return;
        } else if (title.val().length > 50) {
            review.append("<div class='error' role='alert'>Title should be less than 50 characters</div>");
            return;
        } else if (content.val().length > 500) {
            review.append("<div class='error' role='alert'>Content should be less than 500 characters</div>");
            return;
        } else {
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
                    alert(err.responseText);
                },
            };
            $.ajax(requestConfig).then(function (responseMessage) {
                window.location.href = `/park/${responseMessage.parkId}`;
            });
        }
    });
    var isClicked = false;
    reply.click(function (e) {
        e.preventDefault();
        var thisReply = $(this).parent().parent();
        if (isClicked && thisReply.find('.replyContent').length > 1) {
            thisReply.find('.replyContent').remove();
            isClicked = false;
            return;
        } else if (!isClicked && thisReply.find('.replyContent').length == 0 ) {
            isClicked = true;
            thisReply.append("<div class='replyContent'><form name='postReply' id='postReply'><textarea class='replyContent' rows='4' cols='50' placeholder='Reply'></textarea> <input type='submit' value='Submit' /></form></div>");
        } else {
            alert("Close the other reply box first");
        }
    });
    var replyClass = $("#postReply");
    replyClass.submit(function (e) {
        e.preventDefault();
        var replyContent = $(this).find('.replyContent').val();
        var reviewId = $(this).parent().parent().find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/reply/add',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
                replyContent: replyContent,
                parkName: parkName.text(),
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            window.location.href = `/park/${responseMessage.parkId}`;
        });
    });
    

})(window.jQuery);