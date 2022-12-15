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
            thisReply.append("<div class='replyContent'><form name='postReply' id='postReply'><textarea class='replyContent' id='replyContent' rows='4' cols='50' placeholder='Reply'></textarea> <input type='submit' value='Submit' /></form></div>");
            var replyClass = $("#postReply");
            replyClass.submit(replySubmit);
        } else {
            alert("Close the other reply box first");
        }
    });
    function replySubmit(e) {
        e.preventDefault();
        var replyContent = $(this).parent().find('.replyContent').val();
        var reviewId = $(this).parent().parent().find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/comment/add',
            contentType: "application/json",
            data: JSON.stringify({
                parkName: parkName.text(),
                reviewId: reviewId,
                replyContent: replyContent,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            window.location.href = `/park/${responseMessage.parkId}`;
        });
    };
    
    like.click(function (e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        var reviewId =parent.find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/review/like',
            contentType: "application/json",
            data: JSON.stringify({
                parkName: parkName.text(),
                reviewId: reviewId,
            }),
            error: function (err) {
                if (err.responseText.includes("liked this review")) {
                    removeLike(e);
                }
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            parent.append('<div class="likes">Liked!</div>');
        });
    });

    function removeLike(e){
        e.preventDefault();
        var parent = $(this).parent().parent();
        var reviewId =parent.find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/review/like',
            contentType: "application/json",
            data: JSON.stringify({
                parkName: parkName.text(),
                reviewId: reviewId,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            parent.find('.likes').text("UnLiked!");
            parent.find('.likes').css('color', 'red');
        });
    }

})(window.jQuery);