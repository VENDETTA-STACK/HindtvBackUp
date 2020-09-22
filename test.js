const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2008,0,12);
const secondDate = new Date(2008,0,22);
console.log(firstDate);
console.log(secondDate);
const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
console.log(diffDays);
