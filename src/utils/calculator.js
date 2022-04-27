export const calculateDateConcieved = (date) => {
  const newDate = new Date(date);

  newDate.setDate(date.getDate() + 14);
  return newDate;
};

export const getFirstTrimester = (date) => {
  const newDate = new Date(date);

  newDate.setDate(date.getDate() + 84);
  return newDate;
};

export const getSecondTrimester = (date) => {
  const newDate = new Date(date);

  newDate.setDate(date.getDate() + 189);
  return newDate;
};

export const getEstimatedDueDate = (date) => {
  const newDate = new Date(date);

  newDate.setDate(date.getDate() + 280);
  return newDate;
};

export const getWeeksGone = (date) => {
  const now = new Date();
  const dateConcieved = new Date(`${date} 00:00:00`);

  dateConcieved.setDate(dateConcieved.getDate() - 13);

  const dateDiff = now.getTime() - dateConcieved.getTime();
  const diffDays = (dateDiff / (1000 * 3600 * 24)).toFixed();

  const weeks = (diffDays / 7).toString().split(".");
  return diffDays % 7 === 0 ? diffDays / 7 : `${weeks[0]}.${diffDays % 7}`;
};
