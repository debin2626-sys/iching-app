import { describe, it, expect } from 'vitest';
import { normalizeEmail } from '../normalizeEmail';

describe('normalizeEmail', () => {
  it('strips dots from gmail local part', () => {
    expect(normalizeEmail('a.b.c@gmail.com')).toBe('abc@gmail.com');
  });

  it('strips dots from googlemail.com', () => {
    expect(normalizeEmail('a.b@googlemail.com')).toBe('ab@gmail.com');
  });

  it('strips +tag alias from gmail', () => {
    expect(normalizeEmail('user+tag@gmail.com')).toBe('user@gmail.com');
  });

  it('strips dots AND +tag together', () => {
    expect(normalizeEmail('u.s.e.r+promo@gmail.com')).toBe('user@gmail.com');
  });

  it('lowercases gmail', () => {
    expect(normalizeEmail('User.Name@Gmail.COM')).toBe('username@gmail.com');
  });

  it('handles numeric gmail addresses', () => {
    expect(normalizeEmail('123.456@gmail.com')).toBe('123456@gmail.com');
  });

  it('returns non-gmail domains unchanged (lowercased)', () => {
    expect(normalizeEmail('a.b.c@outlook.com')).toBe('a.b.c@outlook.com');
  });

  it('preserves +tag for non-gmail domains', () => {
    expect(normalizeEmail('user+tag@yahoo.com')).toBe('user+tag@yahoo.com');
  });

  it('trims whitespace', () => {
    expect(normalizeEmail('  user@gmail.com  ')).toBe('user@gmail.com');
  });

  it('handles edge case: no @ sign', () => {
    expect(normalizeEmail('noemail')).toBe('noemail');
  });
});
