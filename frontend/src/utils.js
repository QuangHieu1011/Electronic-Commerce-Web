export const isJsonString = (data) => {
    try {
        JSON.parse(data)
        return true
    } catch (error) {
        return false
    }
}
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });