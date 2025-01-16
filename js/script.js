const imageInput = document.getElementById("image_input");
const displayImageCanvas = document.getElementById("display_image");
const ctx = displayImageCanvas.getContext("2d");
const downloadButton = document.getElementById("download");
const container = document.querySelector(".container");

const MAX_CANVAS_WIDTH = 1000;
const MAX_CANVAS_HEIGHT = 1000;

displayImageCanvas.width = container.offsetWidth;
displayImageCanvas.height = container.offsetHeight;

let uploadedFile = null; // Store the uploaded file globally
let img = new Image();

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile = file; // Save file globally for download
    img.onload = () => {
      const aspectRatio = img.width / img.height;

      // Resize canvas while maintaining aspect ratio
      let newWidth = img.width;
      let newHeight = img.height;

      if (img.width > MAX_CANVAS_WIDTH || img.height > MAX_CANVAS_HEIGHT) {
        if (aspectRatio > 1) {
          newWidth = MAX_CANVAS_WIDTH;
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = MAX_CANVAS_HEIGHT;
          newWidth = newHeight * aspectRatio;
        }
      }

      displayImageCanvas.width = newWidth;
      displayImageCanvas.height = newHeight;

      // Draw image and text on canvas
      ctx.clearRect(0, 0, displayImageCanvas.width, displayImageCanvas.height);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      ctx.font = "50px sfpro";
      ctx.fillStyle = "white";
      ctx.fillText("Hello World", 50, newHeight - 50);
    };

    img.src = URL.createObjectURL(file);
  }
});

downloadButton.addEventListener("click", () => {
  if (!uploadedFile) {
    alert("No image uploaded!");
    return;
  }

  const downloadCanvas = document.createElement("canvas");
  const downloadCtx = downloadCanvas.getContext("2d");

  img.onload = () => {
    downloadCanvas.width = img.width;
    downloadCanvas.height = img.height;

    // Draw the image and text on the new canvas
    downloadCtx.drawImage(img, 0, 0, img.width, img.height);
    downloadCtx.font = "50px sfpro";
    downloadCtx.fillStyle = "white";
    downloadCtx.fillText("Hello", 50, img.height - 50);

    // Trigger download
    const link = document.createElement("a");
    link.href = downloadCanvas.toDataURL("image/png");
    link.download = "image_with_text.png";
    link.click();
  };

  img.src = URL.createObjectURL(uploadedFile); // Use the globally saved file
});

// Add button functionality
displayImageCanvas.addEventListener("click", () => {
  console.log("ﾔｼﾞｭｾﾝﾊﾟｲｲｷｽｷﾞﾝｲｸｲｸｱｯｱｯｱｯｱｰﾔﾘﾏｽﾈ");
});

// if image height < width, then the text is 1/2 the size of when the image is height < width.