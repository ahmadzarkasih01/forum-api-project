const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    const { thread, comment, owner } = deleteComment;
    
    await this._threadRepository.verifyThreadIsExist(thread);
    await this._commentRepository.verifyCommentIsExist(comment);
    await this._commentRepository.verifyCommentOwner(comment, owner);
    await this._commentRepository.deleteComment(comment);
  }
}

module.exports = DeleteCommentUseCase;