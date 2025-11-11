const CreatedThread = require("../CreatedThread");

describe("CreatedThread entities", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "New Thread",
      // owner missing
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload does not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      title: ["Title"], // should be string
      owner: true, // should be string
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create CreatedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "New Thread",
      owner: "user-123",
    };

    // Action
    const addedThread = new CreatedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
