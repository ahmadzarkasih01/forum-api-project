class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    this.comments = this._remapComments(payload.comments);
  }

  _verifyPayload({ comments }) {
    if (!comments) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!Array.isArray(comments)) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

   _remapComments(comments) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
    }));
  }
}

module.exports = CommentDetail;