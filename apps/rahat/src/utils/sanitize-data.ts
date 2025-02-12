export function sanitizeNonAlphaNumericValue(input: string): string {
  return input.replace(/[^\w\s]/gi, ''); // Remove all non-alphanumeric characters except whitespace
}

export const sanitizeData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      return sanitizeData(item);
    });
  } else if (typeof data === 'object' && data !== null) {
    const sanitizedObject: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitizedObject[key] = trimNonAlphaNumericValue(data[key]);
      }
    }
    return sanitizedObject;
  } else if (typeof data === 'string') {
    return sanitizeNonAlphaNumericValue(data);
  } else {
    return data;
  }
}

export const sanitizeTrimValue = (input: string): string => {
  return input.trim();
}

// Utility function to remove all non-alphanumeric characters except spaces
export const trimNonAlphaNumericValue = (input: string): string => {
  return input ? input.replace(/[^\w\s]/g, '').trim() : ''; // Remove all non-alphanumeric characters except spaces and trim the string
}
