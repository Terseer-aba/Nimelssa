const submitBtn = document.querySelector('.submit_btn');
const userName = document.querySelector('#user');
const comment = document.querySelector('#comment');
const likeIcon = document.querySelector('.heart_icon');
const count = document.querySelector('.count');
const commentsCont = document.querySelector('.comments_container');

likeIcon.addEventListener('click', likeVideo);
submitBtn.addEventListener('click', submitFeedback);

let feedbackArr = getStoredComments();
let positiveFeedback = false;
let likesCount = getStoredLikesCount(); // Retrieve likes count from local storage

function submitFeedback(e) {
    const userForm = userName.value;
    const commentForm = comment.value;

    if (userForm && commentForm !== '') {
        const newFeedback = {
            "id": Math.floor((Math.random() * 1000) + 1),
            "userName": userForm,
            "userComment": commentForm,
            "typeOfFeedback": positiveFeedback,
            "timestamp": Date.now()
        };

        feedbackArr.push(newFeedback);

        if (positiveFeedback === true) {
            addLikes();
        }

        resetForm();
        addFeedback(newFeedback);

        saveCommentsToLocalStorage();

        setTimeout(() => {
            removeFeedback(newFeedback.id);
        }, 72 * 60 * 60 * 1000);
    }

    e.preventDefault();
}

function likeVideo() {
    likeIcon.classList.toggle('liked');

    if (likeIcon.classList.contains('liked')) {
        likeIcon.innerHTML = `<i class="fas fa-heart"></i>`;
        positiveFeedback = true;
        addLikes();
        updateLikeCountTimestamp();
    } else {
        likeIcon.innerHTML = `<i class="far fa-heart"></i>`;
        positiveFeedback = false;
    }
}

function addLikes() {
    likesCount++;
    count.innerHTML = likesCount;
    saveLikesCountToLocalStorage();
}

function resetForm() {
    userName.value = '';
    comment.value = '';
    likeIcon.innerHTML = `<i class="far fa-heart"></i>`;
    positiveFeedback = false;
}

function addFeedback(item) {
    const letter = item.userName.charAt(0);
    const div = document.createElement('div');
    div.classList = 'comment_card';
    div.id = item.id;
    div.innerHTML = `
        <div class="pic center_display">
            ${letter}
        </div>
        <div class="comment_info">
            <small class="nickname">
                ${item.userName}
            </small>
            <p class="comment">
                ${item.userComment}
            </p>
            <div class="comment_bottom">
                <div class="heart_icon_comment">
                    ${item.typeOfFeedback ? `<i class="fas fa-heart positive"></i>` : `<i class="far fa-heart"></i>`} 
                </div>
              
                <button>
                  
                </button>
            </div>
        </div>
    `;

    commentsCont.insertAdjacentElement('beforeend', div);
}

function removeFeedback(feedbackId) {
    const indexToRemove = feedbackArr.findIndex(item => item.id === feedbackId);

    if (indexToRemove !== -1) {
        feedbackArr.splice(indexToRemove, 1);

        const feedbackElement = document.getElementById(feedbackId);
        if (feedbackElement) {
            feedbackElement.remove();
        }

        saveCommentsToLocalStorage();
    }
}

function saveCommentsToLocalStorage() {
    localStorage.setItem('comments', JSON.stringify(feedbackArr));
}

function getStoredComments() {
    const storedComments = localStorage.getItem('comments');
    return storedComments ? JSON.parse(storedComments) : [];
}

function saveLikesCountToLocalStorage() {
    localStorage.setItem('likesCount', likesCount);
    localStorage.setItem('likesCountTimestamp', Date.now());
}

function getStoredLikesCount() {
    const storedLikesCount = localStorage.getItem('likesCount');
    const storedLikesCountTimestamp = localStorage.getItem('likesCountTimestamp');

    if (storedLikesCount && storedLikesCountTimestamp) {
        const timeElapsed = Date.now() - parseInt(storedLikesCountTimestamp, 10);
        if (timeElapsed < 72 * 60 * 60 * 1000) {
            return parseInt(storedLikesCount, 10);
        }
    }

    // Reset likes count after 72 hours
    return 0;
}

// Display comments from local storage on page load
feedbackArr.forEach(item => {
    const timeElapsed = Date.now() - item.timestamp;
    if (timeElapsed < 72 * 60 * 60 * 1000) {
        addFeedback(item);
    } else {
        removeFeedback(item.id);
    }
});

// Display likes count from local storage on page load
count.innerHTML = likesCount;
/* ... (previous code)

function addFeedback(item) {
    const letter = item.userName.charAt(0);
    const div = document.createElement('div');
    div.classList = 'comment_card';
    div.id = item.id;
    div.innerHTML = `
        <div class="pic center_display">
            ${letter}
        </div>
        <div class="comment_info">
            <small class="nickname">
                ${item.userName}
            </small>
            <p class="comment">
                ${item.userComment}
            </p>
            <div class="comment_bottom">
                <div class="heart_icon_comment">
                    ${item.typeOfFeedback ? `<i class="fas fa-heart positive"></i>` : `<i class="far fa-heart"></i>`} 
                </div>
              
                <button class="replyBtn">
                  
                </button>
            </div>
        </div>
    `;

    const replyButton = div.querySelector('.replyBtn');
    replyButton.addEventListener('click', () => handleReply(item.id));

    commentsCont.insertAdjacentElement('beforeend', div);
}

function handleReply(commentId) {
    // You can implement the reply functionality here.
    // For example, you can open a modal or navigate to a new page for replying.
    console.log(`Replying to comment with ID: ${commentId}`);
}

// ... (remaining code)

/*
// ... (previous code)

const replyModal = document.getElementById('replyModal');
const closeModalBtn = document.getElementById('closeModal');
const replyForm = document.getElementById('replyForm');
const replyUserNameInput = document.getElementById('replyUserName');
const replyCommentInput = document.getElementById('replyComment');
let currentCommentId; // Variable to store the ID of the comment being replied to

// Add event listeners
const replyButton = div.querySelector('.replyBtn');
replyButton.addEventListener('click', () => openReplyModal(item.id));

closeModalBtn.addEventListener('click', closeReplyModal);

replyForm.addEventListener('submit', function (e) {
    handleReplySubmit();
    e.preventDefault();
});

function openReplyModal(commentId) {
    currentCommentId = commentId;
    replyModal.style.display = 'block';
}

function closeReplyModal() {
    replyModal.style.display = 'none';
    currentCommentId = null;
}

function handleReplySubmit() {
    const replyUserName = replyUserNameInput.value;
    const replyComment = replyCommentInput.value;

    if (replyUserName && replyComment !== '' && currentCommentId) {
        const originalComment = feedbackArr.find(item => item.id === currentCommentId);

        // Create a new comment for the reply
        const reply = {
            "id": Math.floor((Math.random() * 1000) + 1),
            "userName": replyUserName,
            "userComment": replyComment,
            "typeOfFeedback": false, // Assuming replies are not likes
            "timestamp": Date.now()
        };

        // Add the reply to the original comment or create a new comment for the reply
        originalComment.replies = originalComment.replies || [];
        originalComment.replies.push(reply);

        // Reset the form and close the modal
        replyUserNameInput.value = '';
        replyCommentInput.value = '';
        closeReplyModal();

        // Update the displayed comments with the new reply
        updateComments();
    }
}

function updateComments() {
    // Clear existing comments
    commentsCont.innerHTML = '';

    // Display comments from local storage on page load
    feedbackArr.forEach(item => {
        const timeElapsed = Date.now() - item.timestamp;
        if (timeElapsed < 72 * 60 * 60 * 1000) {
            addFeedback(item);
        } else {
            removeFeedback(item.id);
        }

        // Display replies if available
        if (item.replies && item.replies.length > 0) {
            item.replies.forEach(reply => addFeedback(reply));
        }
    });
}

*/ 
//... (remaining code)


