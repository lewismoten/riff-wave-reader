export const ascii = (source, position, length) => {
  let value = "";
  for (let i = 0; i < length; i++) {
    value += String.fromCharCode(source[position + i]);
  }
  return value;
};
export const uint8 = (source, position) => littleEndianU(source, position, 1);
export const uint16 = (source, position) => littleEndianU(source, position, 2);
// TODO: Getting int16 values less than 32768. Start testing min/max/-1/0/1
export const int16 = (source, position) => littleEndian(source, position, 2);
export const int32 = (source, position) => littleEndianU(source, position, 4);

export default {
  ascii,
  uint8,
  uint16,
  int16,
  int32
};

const littleEndian = (source, position, length) => {
  let value = littleEndianU(source, position, length);
  const max = Math.pow(2, length * 8);
  if (value > max / 2 - 1) {
      value -= max
  }
  return value;
}

const littleEndianU = (source, position, length) => {
  let value = 0;
  for (let i = length - 1; i >= 0; i--) {
    value *= 0b100000000;
    value += source[position + i];
  }
  return value;
};
