import JSONbig from 'json-bigint';

const parse = JSONbig({useNativeBigInt: true}).parse;
const stringify = JSONbig({useNativeBigInt: true}).stringify;

// because parse will convert bigint to number, so we need to compare bigint by this special function
const bigintEqual = (a: bigint, b: bigint) => {
  return BigInt(a) === BigInt(b);
};

export default {
  parse,
  stringify,
  bigintEqual,
};
