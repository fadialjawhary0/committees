export const TruncateFileName = (fileName, maxLength = 45) => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.slice(fileName.lastIndexOf('.'));
  const name = fileName.slice(0, fileName.lastIndexOf('.'));
  const half = Math.floor((maxLength - extension.length) / 2);
  return `${name.slice(0, half)}...${name.slice(-half)}${extension}`;
};
