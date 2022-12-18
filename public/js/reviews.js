(function ($) {
    var login = $("#login"),
        title = $("#submitTitle"),
        content = $("#content"),
        rating = $("#rating"),
        postReview = $("#postReview"),
        review = $("#review");
        reply = $(".reply");
        like = $(".like");
        unlike = $(".unlike");
        replyClass = $(".review-ui"),
        id = $(".review-id");
        commentId = $(".comment-id");
        deleteReview = $(".deleteReview");
        deleteReply = $(".deleteReply");
        editReview = $(".editReview");
        windowCoords = $("#windowCoord");
        // xCoord = $("#xCoord").text();
        yCoord = $("#yCoord").text();
    var  y;
    window.scrollTo(0, yCoord);
    $(document).click(function (e) {
        y = e.pageY;
    });
    if (windowCoords.is(':visible')) {
        windowCoords.hide();
    }
    if (id.is(':visible')) {
        id.hide();
    }
    if (commentId.is(':visible')) {
        commentId.hide();
    }
    login.click(function () {
        window.location.href = "/login";
    });

    //keydown input text to next input text

    postReview.submit(function (e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        parent.find(".error").remove();
        if (!title.val() || !content.val() || !rating.val()) {
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
                    reviewTitle: title.val(),
                    content: content.val(),
                    rating: rating.val(),
                    y: y,
                }),
                error: function (err) {
                    // window.location.href = "/review/error/" + err.responseText;
                    alert(err.responseText);
                },
            };
            $.ajax(requestConfig).then(function (responseMessage) {
                window.location.href = `/park/search?searchParkName=${responseMessage.parkName}`;
            });
        }
    });
    var isClicked = false;
    reply.click(function (e) {
        e.preventDefault();
        var thisReply = $(this).parent().parent();
        if (isClicked && thisReply.find('.replyContent').length > 1) {
            thisReply.find(".error").remove();
            thisReply.find('.replyContent').remove();
            thisReply.find('.editReview').prop('disabled', false);
            isClicked = false;
            return;
        } else if (!isClicked && thisReply.find('.replyContent').length == 0 ) {
            isClicked = true;
            thisReply.append("<div class='replyContent'><form name='postReply' id='postReply'><textarea class='replyContent' id='replyContent' rows='4' cols='50' placeholder='Reply'></textarea> <input type='submit' value='Submit' /></form></div>");
            var replyClass = $("#postReply");
            thisReply.find('.editReview').prop('disabled', true);
            thisReply.find('.error').remove();
            replyClass.submit(replySubmit);
            $('.replyContent').keydown(function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    $(this).parent().submit();
                }
            });
            
        } else {
            alert("Close the other reply box first");
        }
    });
    function replySubmit(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        var replyContent = $(this).parent().find('.replyContent').val();
        var reviewId = $(this).parent().parent().find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/comment/add',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
                replyContent: replyContent,
                y: y,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };
        if (!replyContent) {
            parent.find('.error').remove();
            parent.append("<div class='error' role='alert'>Please fill all the fields</div>");
            return;
        } else if (replyContent.length > 100) {
            parent.find('.error').remove();
            parent.append("<div class='error' role='alert'>Reply should be less than 100 characters</div>");
            return;
        } else {
            
            $.ajax(requestConfig).then(function (responseMessage) {
                window.location.href = `/park/search?searchParkName=${responseMessage.parkName}`;
            });
        }
    };
    
    like.click(likePost);
    function likePost (e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        parent.find('.error').remove();
        var reviewId =parent.find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/review/like',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            parent.find('.like').remove();
            parent.find('.unlikeD').remove();
            parent.find('.reply').after(' <button  type="button" class="unlike">Unlike</button> <div class="likes">Liked!</div>');
            var likes = parent.find('.review-likes');
            likes.text('Likes: '+(parseInt(likes.text().split(' ')[1]) + 1));
            parent.find('.unlike').click(unlikePost);
        });
    };
    unlike.click(unlikePost);
    function unlikePost (e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        parent.find('.error').remove();
        var reviewId =parent.find('.review-id').text();
        var requestConfig = {
            method: 'POST',
            url: '/review/unlike',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            parent.find(".likes").remove();
            parent.find('.unlike').remove();
            parent.find('.reply').after(' <button  type="button" class="like">Like</button> <div class="unlikeD">unlike!</div>');
            var likes = parent.find('.review-likes');
            likes.text('Likes: '+(parseInt(likes.text().split(' ')[1]) - 1));
            parent.find('.like').click(likePost);
        });
        return;
    };

    deleteReview.click(function (e) {
        e.preventDefault();
        y = e.pageY;
        var parent = $(this).parent().parent();
        var reviewId =parent.find('.review-id').text();
        var requestConfig = {
            method: 'DELETE',
            url: '/review/delete',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
                y: y,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            window.location.href = `/park/search?searchParkName=${responseMessage.parkName}`;
        });
    });

    deleteReply.click(function (e) {
        e.preventDefault();
        y = e.pageY;
        var parent = $(this).parent();
        var commentId =parent.find('.comment-id').text();
        var requestConfig = {
            method: 'DELETE',
            url: '/comment/delete',
            contentType: "application/json",
            data: JSON.stringify({
                commentId: commentId,
                y: y,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            window.location.href = `/park/search?searchParkName=${responseMessage.parkName}`;
        });
    });
    var editIsClicked = false;

    editReview.click(function (e) {
        
        e.preventDefault();
        var parent = $(this).parent().parent();
        var reviewId =parent.find('.review-id').text();
        var reviewTitle =parent.find('.review-title').text();
        var content =parent.find('.content').text();
        var rating =parent.find('.rating').text();
        if (editIsClicked && parent.find('.editContent').length > 0) {
            parent.find(".error").remove();
            parent.find('.editContent').remove();
            editIsClicked = false;
            times = 0;
            parent.find('.reply').prop('disabled', false);
            return;
        } else if (!editIsClicked && parent.find('.editContent').length == 0) {
            parent.find('.error').remove();
            editIsClicked = true;
            times = 1;
            parent.append("<div class='editContent'><form name='editReview' id='editReview'><input type='text' id='editTitle' placeholder='Title' /> <textarea class='editContent' id='editContent' rows='4' cols='50' placeholder='Content'></textarea> <input type='number' id='editRating' min='1' max='5' placeholder='Out of 5' /> <input type='submit' value='Submit' /></form></div>");
            parent.find('.reply').prop('disabled', true);
            var editClass = $("#editReview");
            editClass.submit(editSubmit);
        } else {
            alert("Close the other edit box first");
        }
            // editClass.submit(editSubmit);
        
    });

    function editSubmit(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        var reviewId =parent.find('.review-id').text();
        var reviewTitle =parent.find('#editTitle').val();
        var content =parent.find('#editContent').val();
        var rating =parent.find('#editRating').val();
        var requestConfig = {
            method: 'PUT',
            url: '/review/edit',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
                reviewTitle: reviewTitle,
                content: content,
                rating: rating,
            }),
            error: function (err) {
                alert(err.responseText);
            },
        };
        if (reviewTitle == "" || content == "" || rating == "") {
            parent.find('.error').remove();
            parent.append("<div class='error' role='alert'>Please fill all the fields</div>");
            return;
        } else if (rating > 5 || rating < 1) {
            parent.find('.error').remove();
            parent.append("<div class='error' role='alert'>Rating must be between 1 and 5</div>");
            return;
        } else {
            $.ajax(requestConfig).then(function (responseMessage) {
                window.location.href = `/park/search?searchParkName=${responseMessage.parkName}`;
            });

        }
        
    }

})(window.jQuery);