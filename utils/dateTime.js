const toIsoTimestamp = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

const nowIsoTimestamp = () => toIsoTimestamp();

module.exports = {
  toIsoTimestamp,
  nowIsoTimestamp,
};
