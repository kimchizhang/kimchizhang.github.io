const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toggleTextButton = document.getElementById("toggleText");

let img = null;
let exifText = "";
let textVisible = true; // Tracks if text is visible

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        fitCanvasToImage();
        drawImageWithText();
      };

      // Extract EXIF data
      EXIF.getData(file, function () {
        const exifData = EXIF.getAllTags(this);
        exifText = exifData.Make
          ? `Camera: ${exifData.Make} ${exifData.Model}`
          : "No EXIF data found";
      });
    };
    reader.readAsDataURL(file);
  }
});

// Function to fit the canvas and image within the screen
function fitCanvasToImage() {
  const maxWidth = window.innerWidth * 0.9; // Use 90% of screen width
  const maxHeight = window.innerHeight * 0.8; // Use 80% of screen height

  // Calculate aspect ratio
  const imgAspectRatio = img.width / img.height;
  const screenAspectRatio = maxWidth / maxHeight;

  if (imgAspectRatio > screenAspectRatio) {
    // Image is wider than screen
    canvas.width = maxWidth;
    canvas.height = maxWidth / imgAspectRatio;
  } else {
    // Image is taller than screen
    canvas.height = maxHeight;
    canvas.width = maxHeight * imgAspectRatio;
  }
}

// Function to draw the image with or without text
function drawImageWithText() {
  if (!img) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (textVisible && exifText) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(exifText, 10, 30);
    ctx.fillText(exifText, 10, 30);
  }
}

// Toggle text visibility
toggleTextButton.addEventListener("click", () => {
  textVisible = !textVisible;
  drawImageWithText();
});
