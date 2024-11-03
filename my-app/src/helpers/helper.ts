export const removeEmptyFields = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === "object") {
        removeEmptyFields(obj[key]); // Recursively clean nested objects
        // Remove empty object if all properties are removed
        if (Object.keys(obj[key]).length === 0) delete obj[key];
      } else if (obj[key] === undefined || obj[key] === '') {
        delete obj[key]; // Remove undefined or empty fields
      }
    });
    return obj;
  };