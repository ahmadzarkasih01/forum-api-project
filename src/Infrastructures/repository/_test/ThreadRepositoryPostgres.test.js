jest.mock("nanoid", () => ({
  nanoid: () => "abc123testid",
}));

const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");

describe("ThreadRepositoryPostgres", () => {
  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  it("should be an instance of ThreadRepository domain", () => {
    const pool = {};
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      const payload = {
        title: 'sebuah thread',
        body: 'isi thread',
        owner: userId,
      };
      const fakeIdGenerator = () => 'abc123testid';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(payload);

      // Assert - pastikan data benar-benar masuk database
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-abc123testid');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new CreatedThread({
          id: 'thread-abc123testid',
          title: payload.title,
          owner: payload.owner,
        }),
      );
    });
  });

  describe("verifyThreadIsExist function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist("thread-123")).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" }); // memasukkan user baru dengan id user-123
      await ThreadsTableTestHelper.addThread({ id: "thread-123" }); // memasukkan thread baru dengan id thread-123
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist("thread-123")).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadDetail('thread-xxx'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-234' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-234' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should get thread detail correctly', async () => {
      // Arrange
      const threadValue = {
        id: 'thread-123',
        title: 'Thread Title Sample',
        body: 'Thread Body Sample',
        owner: 'user-123',
        date: 'Thread Date Sample',
      };

      const userValue = {
        id: 'user-123',
        username: 'user123',
      };

      await UsersTableTestHelper.addUser(userValue);
      await ThreadsTableTestHelper.addThread(threadValue);
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.getThreadDetail(threadValue.id);

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadValue.id);
      expect(thread.title).toEqual(threadValue.title);
      expect(thread.body).toEqual(threadValue.body);
      expect(thread.date).toEqual(threadValue.date);
      expect(thread.username).toEqual(userValue.username);
    });
  });
});