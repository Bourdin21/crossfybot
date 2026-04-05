'use strict';

const path = require('path');
const fs = require('fs');
const { loadAuthorizedUsers, validate, isAuthorized, getActiveUsers } = require('../src/auth');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

function writeFixture(name, data) {
  const filePath = path.join(FIXTURES_DIR, name);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

beforeAll(() => {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
});

afterAll(() => {
  fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
});

describe('loadAuthorizedUsers', () => {
  test('loads and parses the real authorized.json file', () => {
    const data = loadAuthorizedUsers();
    expect(data.version).toBe(1);
    expect(Array.isArray(data.users)).toBe(true);
    expect(data.users.length).toBeGreaterThan(0);
  });

  test('throws on non-existent file', () => {
    expect(() => loadAuthorizedUsers('/tmp/does-not-exist.json')).toThrow();
  });
});

describe('validate', () => {
  test('rejects missing version', () => {
    expect(() => validate({ users: [] })).toThrow('"version" must be a number');
  });

  test('rejects non-array users', () => {
    expect(() => validate({ version: 1, users: 'bad' })).toThrow('"users" must be an array');
  });

  test('rejects user without email', () => {
    expect(() =>
      validate({ version: 1, users: [{ active: true }] })
    ).toThrow('non-empty "email"');
  });

  test('rejects user without active flag', () => {
    expect(() =>
      validate({ version: 1, users: [{ email: 'a@b.com' }] })
    ).toThrow('boolean "active"');
  });

  test('rejects invalid until date', () => {
    expect(() =>
      validate({ version: 1, users: [{ email: 'a@b.com', active: true, until: 'not-a-date' }] })
    ).toThrow('invalid "until" date');
  });

  test('accepts valid data', () => {
    expect(() =>
      validate({
        version: 1,
        users: [
          { email: 'a@b.com', active: true },
          { email: 'c@d.com', active: false, until: '2030-01-01' },
        ],
      })
    ).not.toThrow();
  });
});

describe('isAuthorized', () => {
  const data = {
    version: 1,
    users: [
      { email: 'active@test.com', active: true },
      { email: 'inactive@test.com', active: false },
      { email: 'expired@test.com', active: true, until: '2020-01-01' },
      { email: 'future@test.com', active: true, until: '2099-12-31' },
    ],
  };

  test('returns true for active user', () => {
    expect(isAuthorized('active@test.com', data)).toBe(true);
  });

  test('returns false for inactive user', () => {
    expect(isAuthorized('inactive@test.com', data)).toBe(false);
  });

  test('returns false for expired user', () => {
    expect(isAuthorized('expired@test.com', data)).toBe(false);
  });

  test('returns true for user with future expiration', () => {
    expect(isAuthorized('future@test.com', data)).toBe(true);
  });

  test('returns false for unknown email', () => {
    expect(isAuthorized('nobody@test.com', data)).toBe(false);
  });

  test('email comparison is case-insensitive', () => {
    expect(isAuthorized('ACTIVE@TEST.COM', data)).toBe(true);
  });
});

describe('getActiveUsers', () => {
  const data = {
    version: 1,
    users: [
      { email: 'a@test.com', active: true },
      { email: 'b@test.com', active: false },
      { email: 'c@test.com', active: true, until: '2020-01-01' },
      { email: 'd@test.com', active: true, until: '2099-12-31' },
    ],
  };

  test('returns only active non-expired users', () => {
    const active = getActiveUsers(data);
    const emails = active.map((u) => u.email);
    expect(emails).toEqual(['a@test.com', 'd@test.com']);
  });
});
