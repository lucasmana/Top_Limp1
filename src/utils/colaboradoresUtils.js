const crypto = require('crypto');

const normalizeCpfDigits = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 11);

const isValidCpf = (cpfValue) => {
  const digits = normalizeCpfDigits(cpfValue);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  const nums = digits.split('').map(Number);

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += nums[i] * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== nums[9]) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += nums[i] * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === nums[10];
};

const parseDateInput = (value) => {
  const v = String(value ?? '').trim();
  if (!v) return null;

  const isoLike = /^\d{4}-\d{2}-\d{2}/.test(v);
  if (isoLike) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (br) {
    const dd = Number(br[1]);
    const mm = Number(br[2]);
    const yyyy = Number(br[3]);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (Number.isNaN(d.getTime())) return null;
    if (d.getUTCFullYear() !== yyyy || d.getUTCMonth() !== mm - 1 || d.getUTCDate() !== dd) return null;
    return d;
  }

  const digits = v.replace(/\D/g, '');
  if (digits.length === 8) {
    const dd = Number(digits.slice(0, 2));
    const mm = Number(digits.slice(2, 4));
    const yyyy = Number(digits.slice(4, 8));
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    if (Number.isNaN(d.getTime())) return null;
    if (d.getUTCFullYear() !== yyyy || d.getUTCMonth() !== mm - 1 || d.getUTCDate() !== dd) return null;
    return d;
  }

  return null;
};

const hashSecret = (secret) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(secret), salt, 64).toString('hex');
  return { salt, hash, algo: 'scrypt' };
};

module.exports = { normalizeCpfDigits, isValidCpf, parseDateInput, hashSecret };

