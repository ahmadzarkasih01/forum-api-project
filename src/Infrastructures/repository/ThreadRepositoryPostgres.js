const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const { nanoid } = require('nanoid');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${nanoid(16)}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);
    return new CreatedThread(result.rows[0]);
  }

  async verifyThreadIsExist(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadDetail(threadId) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    // Sebaiknya pengecekan ini dilakukan di use case dengan memanggil fungsi verifyThreadIsExist sehingga logika bisnis di use case dapat tergambar lebih jelas ya

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;