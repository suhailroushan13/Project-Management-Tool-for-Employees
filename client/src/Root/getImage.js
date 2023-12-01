function getImagePathFromLocalStorage(id) {
  // Retrieve the image path from local storage
  const imagePath = localStorage.getItem("userData");
  console.log(imagePath);

  // If the image path is not found in local storage, return the default path
  return imagePath || defaultPath;
}

getImagePathFromLocalStorage(1);
