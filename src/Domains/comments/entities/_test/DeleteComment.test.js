const DeleteComment = require('../DeleteComment');

describe('DeleteComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      // owner tidak ada
    };

    // Action & Assert
    expect(() => new DeleteComment(payload))
      .toThrowError('DELETE_COMMENT.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error when payload properties have wrong data types', () => {
    // Arrange
    const payload = {
      thread: 123, // bukan string
      comment: true, // bukan string
      owner: {}, // bukan string
    };

    // Action & Assert
    expect(() => new DeleteComment(payload))
      .toThrowError('DELETE_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment entity correctly when payload is valid', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.thread).toEqual(payload.thread);
    expect(deleteComment.comment).toEqual(payload.comment);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
