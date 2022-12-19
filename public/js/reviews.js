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
       
    window.scrollTo(0, yCoord);
    $(document).click(function (e) {
        
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

    
    $('#review').on('click', '.deleteReview', deleteReviewPost);
    $('#review').on('click', '.deleteReply', deleteReplyPost);
    $('#review').on('click', '.editReview', editReviewPost);
    $('#review').on('click', '.reply', replyCheck);
    $('#review').on('click', '.like', likePost);
    $('#review').on('click', '.unlike', unlikePost);
    $('#review').on('submit', '#postReply', replySubmit);
    $('#review').on('submit', '#editReview', editSubmit);
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
                    
                }),
                error: function (err) {

                    $('#review').find('.error').remove();
                    var error = $.parseJSON(err.responseText);
                    parent.append(` <div class='error' role='alert'>${error.error}</div>`);
                },
            };
            $.ajax(requestConfig).then(function (responseMessage) {
                var review = responseMessage.review;
                var rating = $("#park_rating");
                var reviewClass = $("#review");
                reviewClass.find(".leaveReview").before(`<div class = 'reviews' name = ${review._id}> <section class = 'review-info'> <p class = 'review-id'>${review._id}</p> <p class = 'review-title'>Title: ${review.title} </p>  <p class = 'review-username'>Author: ${review.userName} </p> <p class = 'review-rating'>Rating: ${review.rating} </p>  <p class = 'review-date'>Date: ${review.lastUpdatedTime}</p> <p class="review-likes">Likes: ${review.number_of_likes}</p></section> <section class = 'review-content'> <p class = 'review-content'>Content: ${review.content}</p> </section> <div class = 'replyUi'> <button type='button' class = 'reply'>Reply</button> <button type="button" class = 'like'>Like</button></div> <div class = 'deleteUi'> <button type='button' class = 'deleteReview'>Delete</button> <button type='button' class = 'editReview'>Edit</button> </div> </div>`);
                if ( reviewClass.find('.review-id').is(':visible')) {
                    reviewClass.find('.review-id').hide();
                }
                $('#park_rating').text(`Overall Rating: ${responseMessage.rating}`);
                title.val("");
                content.val("");
                rating.val("");
                $('#review').find('.error').remove();
                return;
            });
        }
    });
    function replyCheck(e) {
        e.preventDefault();
        var thisReply = $(this).parent().parent();
        if (thisReply.find('.replyContent').length === 2 ) {
            thisReply.find(".error").remove();
            thisReply.find('.replyContent').remove();
            thisReply.find('.editReview').prop('disabled', false);
            isClicked = false;
            return;
        } else if (thisReply.find('.replyContent').length === 0 ) {
            isClicked = true;
            thisReply.append("<div class='replyContent'><form name='postReply' id='postReply'><label for='replyContent'>Reply Content</label><textarea class='replyContent' id='replyContent' rows='4' cols='50' placeholder='Reply'></textarea> <input type='submit' value='Submit' id='submitReply' aria-label='Reply Submit'/></form></div>");
            var replyClass = $("#postReply");
            thisReply.find('.editReview').prop('disabled', true);
            thisReply.find('.error').remove();
            
            $('.replyContent').keydown(function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    $(this).parent().submit();
                }
            });
            
        } 
    };
    function replySubmit(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        var replyContent = $(this).parent().find('.replyContent').val();
        var reviewId = $(this).parent().parent().find('.review-id').text();
        if (!replyContent) {
            parent.find('.error').remove();
            parent.append("<div class='error' role='alert'>Please fill all the fields</div>");
            return;
        } else if (replyContent.length > 100) {
            parent.find('.error').remove();
            parent.append("<div class='error' role='alert'>Reply should be less than 100 characters</div>");
            return;
        } else {
            var requestConfig = {
                method: 'POST',
                url: '/comment/add',
                contentType: "application/json",
                data: JSON.stringify({
                    reviewId: reviewId,
                    replyContent: replyContent,
                    
                }),
                error: function (err) {

                    parent.find('.error').remove();
                    var error = $.parseJSON(err.responseText);
                    parent.append(` <div class='error' role='alert'>${error.error}</div>`);
                },
            };
        
            
            $.ajax(requestConfig).then(function (responseMessage) {
                parent.find('.error').remove();
                var userName = responseMessage.userName;
                var comment = responseMessage.comment;
                parent.append(`<div class = 'comments' name = ${comment._id}> <section class = 'comment-info'> <p class = 'comment-id'>${comment._id}</p> <p class = 'comment-username'>Reply from: ${userName} </p> </section> <section class = 'comment-content'> <p class = 'comment-content'>Content: ${comment.content}</p> </section> <div class = 'deleteReply'> <button type='button' class = 'deleteReplyButton'>Delete this Reply</button> </div> </div>`);
                parent.find('.replyContent').remove();
                parent.find('.comment-id').hide();
            });
        }
    };
    
    
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
                var error = $.parseJSON(err.responseText);
                parent.append(` <div class='error' role='alert'>${error.error}</div>`);
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
                var error = $.parseJSON(err.responseText);
                parent.append(` <div class='error' role='alert'>${error.error}</div>`);
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

    function deleteReviewPost(e) {
        e.preventDefault();
        
        var parent = $(this).parent().parent();
        var reviewId =parent.find('.review-id').text();
        var requestConfig = {
            method: 'DELETE',
            url: '/review/delete',
            contentType: "application/json",
            data: JSON.stringify({
                reviewId: reviewId,
                
            }),
            error: function (err) {
                var error = $.parseJSON(err.responseText);
                parent.append(` <div class='error' role='alert'>${error.error}</div>`);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            parent.find('.error').remove();
            $('#park_rating').text(`Overall Rating: ${responseMessage.rating}`);
            parent.remove();
        });
        
       
    };

    function deleteReplyPost(e) {
        e.preventDefault();
        
        var parent = $(this).parent();
        var commentId =parent.find('.comment-id').text();
        var requestConfig = {
            method: 'DELETE',
            url: '/comment/delete',
            contentType: "application/json",
            data: JSON.stringify({
                commentId: commentId,
                
            }),
            error: function (err) {
                var error = $.parseJSON(err.responseText);
                parent.append(` <div class='error' role='alert'>${error.error}</div>`);
            },
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            parent.parent().find('.error').remove();
            parent.remove();
        });
    };

    function editReviewPost(e) {
        
        e.preventDefault();
        var parent = $(this).parent().parent();
        if (parent.find('.editContent').length > 0) {
            parent.find(".error").remove();
            parent.find('.editContent').remove();
            editIsClicked = false;
            times = 0;
            parent.find('.reply').prop('disabled', false);
            return;
        } else if (parent.find('.editContent').length === 0) {
            parent.find('.error').remove();
            editIsClicked = true;
            times = 1;
            parent.append("<div class='editContent'><form name='editReview' id='editReview'><label for='editTitle'>Title</label><input type='text' id='editTitle' placeholder='Title' aria-label='editTitle'/><label for='editContent'>editContent</label> <textarea class='editContent' id='editContent' rows='4' cols='50' placeholder='Content'></textarea><label for='editRating'>editRating</label> <input type='number' name='editRating' id='editRating' min='1' max='5' placeholder='Out of 5' style='width: 100px; height: 15px';/> <input type='submit' value='Submit' aria-label='Submit' /></form></div>");
            parent.find('.reply').prop('disabled', true);
            
        }
        
    };

    function editSubmit(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
         
        var oldTitle = parent.find('.review-title').text().split(':')[1].trim();
        var oldContent = parent.find('.review-content').text().split(':')[1].trim();
        var oldRating = parent.find('.review-rating').text().split(':')[1].trim();
        var reviewId =parent.find('.review-id').text();
        var reviewTitle =parent.find('#editTitle').val();
        var content =parent.find('#editContent').val();
        var rating =parent.find('#editRating').val();
        if (!reviewTitle|| !content || !rating) {
            parent.append("<div class='error' role='alert'>Please fill all the fields</div>");
            return;
        } else if (rating < 1 || rating > 5) {
            parent.append("<div class='error' role='alert'>Rating should be between 1 and 5</div>");
            return;
        } else if (reviewTitle.length > 50) {
            parent.append("<div class='error' role='alert'>Title should be less than 50 characters</div>");
            return;
        } else if (content.length > 500) {
            parent.append("<div class='error' role='alert'>Content should be less than 500 characters</div>");
            return;
        } else if ( reviewTitle === oldTitle && content === oldContent && rating === oldRating){
            parent.append("<div class='error' role='alert'>No changes made</div>");
            return;

        } else {
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
                    var error = $.parseJSON(err.responseText);
                    parent.append(` <div class='error' role='alert'>${error.error}</div>`);
                },
            };
            
            $.ajax(requestConfig).then(function (responseMessage) {
                var reviewObject = responseMessage.review;
                parent.find('.error').remove();
                parent.find('.editContent').remove();
                parent.find('.review-title').text(`Title: ${reviewObject.title}`);
                parent.find('.review-content').text(`Content: ${reviewObject.content}`);
                parent.find('.review-date').text(`Date: ${reviewObject.lastUpdatedTime}`);
                parent.find('.review-rating').text(`Rating: ${reviewObject.rating}`);
                $('#park_rating').text(`Overall Rating: ${responseMessage.rating}`);
            });

        }
        
    }

})(window.jQuery);