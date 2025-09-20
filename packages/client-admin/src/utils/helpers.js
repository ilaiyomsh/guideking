// Generate unique ID for new chapters/sections
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
};

// Create new chapter template
export const createNewChapter = () => ({
  id: generateId('chap_'),
  title: 'New Chapter',
  sections: []
});

// Create new section template
export const createNewSection = () => ({
  id: generateId('sec_'),
  title: 'New Section',
  content: ''
});

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Move item in array
export const moveArrayItem = (array, fromIndex, toIndex) => {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};
