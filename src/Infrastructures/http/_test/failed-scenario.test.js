describe('Forced failed scenario', () => {
  it('should intentionally fail for CI test', () => {
    expect(2 + 2).toBe(5); // ❌ Salah → akan FAIL
  });
});
