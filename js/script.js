const uploadButton = document.getElementById("image_input");
const displayImageCanvas = document.getElementById("display_image");
const ctx = displayImageCanvas.getContext("2d");
const downloadButton = document.getElementById("download");
const container = document.querySelector(".container");
const nameFontSize = (displayImageCanvas.height / displayImageCanvas.width) * 210;
const detailsFontSize = nameFontSize - 35;

const MAX_CANVAS_WIDTH = 7000;
const MAX_CANVAS_HEIGHT = 7000;

displayImageCanvas.width = container.offsetWidth;
displayImageCanvas.height = container.offsetHeight;

let uploadedFile = null; // Store the uploaded file globally
let img = new Image();
let exifData = {};

uploadButton.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile = file; // Save file globally for download
    EXIF.getData(file, function () {
      exifData.cameraModel = EXIF.getTag(this, "Model");
      exifData.dateTaken = EXIF.getTag(this, "DateTimeOriginal");
      exifData.iso = EXIF.getTag(this, "ISOSpeedRatings");
      exifData.aperture = EXIF.getTag(this, "FNumber");
      exifData.exposureTime = EXIF.getTag(this, "ExposureTime");
      exifData.focalLength = EXIF.getTag(this, "FocalLengthIn35mmFilm");

      console.log("Extracted EXIF Data:", exifData);
    });
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
      ctx.font = `${nameFontSize}px sfpro`;
      ctx.fillStyle = "white";

      if (img.width > img.height) {
        drawText(`${exifData.cameraModel}`, newWidth * 0.02, newHeight * 0.93, `${nameFontSize}`, 'sfpro');
        drawText(`${exifData.focalLength}`+"mm"+"・"+"f/"+`${exifData.aperture}`+"・1/"
          +`${1 / exifData.exposureTime}`+"s"+"・"+"ISO"+`${exifData.iso}`, newWidth * 0.02, 
          newHeight * 0.93 + newHeight * 0.037, `${detailsFontSize}`, 'sfpro');
      }
      else {
        drawText(`${exifData.cameraModel}`, newWidth * 0.03, newHeight * 0.945, `${nameFontSize}`, 'sfpro');
        drawText(`${exifData.focalLength}`+"mm"+"・"+"f/"+`${exifData.aperture}`+"・1/"
          +`${1 / exifData.exposureTime}`+"s"+"・"+"ISO"+`${exifData.iso}`, newWidth * 0.03, 
          newHeight * 0.945 + newHeight * 0.03, `${detailsFontSize}`, 'sfpro');
      }

      function drawText(text,centerX,centerY,fontsize,fontface){
        ctx.save();
        ctx.font=fontsize+'px '+fontface;
        ctx.textBaseline='middle';
        ctx.fillText(text,centerX,centerY);
        ctx.restore();
      }
    };
    img.src = URL.createObjectURL(file);
  }
});

downloadButton.addEventListener("click", () => {
  if (!uploadedFile) {
    document.getElementById('xyz').play();
    alert("upload an image first idiot");
    return;
  }

  // Extract the original file name without the extension
  const originalFileName = uploadedFile.name.split(".").slice(0, -1).join(".");
  const downloadFileName = `${originalFileName}_kimchi.png`;

  // Trigger download of the current canvas content
  const link = document.createElement("a");
  link.href = displayImageCanvas.toDataURL("image/png");
  link.download = downloadFileName;
  link.click();
});

// Add button functionality
container.addEventListener("click", () => {
  console.log("ﾔｼﾞｭｾﾝﾊﾟｲｲｷｽｷﾞﾝｲｸｲｸｱｯｱｯｱｯｱｰﾔﾘﾏｽﾈ");
});

const menu = document.querySelector('.menu');
const checkbox = document.getElementById('edit');

// Toggle menu visibility when checkbox is checked/unchecked
checkbox.addEventListener('change', function() {
  if (this.checked) {
    menu.style.display = 'block'; // Show menu
  } else {
    menu.style.display = 'none'; // Hide menu
  }
});

// Optional: Close menu when clicking outside of it
document.addEventListener('click', function(e) {
  if (!menu.contains(e.target) && !checkbox.contains(e.target)) {
    menu.style.display = 'none'; // Close the menu if clicked outside
  }
});
