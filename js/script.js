const uploadButton = document.getElementById("image_input");
const displayImageCanvas = document.getElementById("display_image");
const ctx = displayImageCanvas.getContext("2d");
const downloadButton = document.getElementById("download");
const container = document.querySelector(".container");
const checkboxLogo = document.getElementById('option-1');
const base_image = new Image();

const MAX_CANVAS_WIDTH = 7000;
const MAX_CANVAS_HEIGHT = 7000;

displayImageCanvas.width = container.offsetWidth;
displayImageCanvas.height = container.offsetHeight;

let uploadedFile = null; // Store the uploaded file globally
let img = new Image();
let showBaseImage = checkboxLogo.checked; // Logo shows initially

let exifData = {};

function redraw(img, exifData, base_image, ctx, newWidth, newHeight) {
  ctx.clearRect(0, 0, newWidth, newHeight); // Clear canvas
  ctx.drawImage(img, 0, 0, newWidth, newHeight); // Draw main image

  const exifFour = `${exifData.focalLength}`+"mm"+"・"+"f/"+`${exifData.aperture}`+"・1/"
    +`${1 / exifData.exposureTime}`+"s"+"・"+"ISO"+`${exifData.iso}`;

  if (img.width > img.height) {
    drawText(`${exifData.cameraModel}`, newWidth * 0.02, newHeight * 0.93, newHeight * 0.035, 'sfpro');
    drawText(`${exifFour}`, newWidth * 0.02, 
      newHeight * 0.93 + newHeight * 0.037, newHeight * 0.023, 'sfpro');

    if (showBaseImage && base_image && base_image.complete) {
      console.log("Drawing base image.");
      ctx.drawImage(base_image, newWidth * 0.935, newHeight * 0.91, newWidth * 0.05, newWidth * 0.05);
    } else {
      console.log("Base image not drawn. Either hidden or not loaded.");
    }
  } else {
    drawText(`${exifData.cameraModel}`, newWidth * 0.03, newHeight * 0.945, newWidth * 0.035, 'sfpro');
    drawText(`${exifFour}`, newWidth * 0.03, 
      newHeight * 0.945 + newHeight * 0.03, newWidth * 0.024, 'sfpro'); 

    if (showBaseImage && base_image && base_image.complete) {
      console.log("Drawing base image.");
      ctx.drawImage(base_image, newWidth * 0.91, newHeight * 0.932, newWidth * 0.07, newWidth * 0.07);
    } else {
      console.log("Base image not drawn. Either hidden or not loaded.");
    }
  }
}

function drawText(text,centerX,centerY,fontsize,fontface) {
  ctx.save();
  ctx.font=fontsize+'px '+fontface;
  ctx.textBaseline='middle';
  ctx.fillText(text,centerX,centerY);
  ctx.restore();
}

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
      console.log("ﾔｼﾞｭｾﾝﾊﾟｲｲｷｽｷﾞﾝｲｸｲｸｱｯｱｯｱｯｱｰﾔﾘﾏｽﾈ");
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

      document.querySelector('.instructionTxt').style.display = 'none';

      // Draw image and text on canvas
      ctx.clearRect(0, 0, displayImageCanvas.width, displayImageCanvas.height);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      ctx.fillStyle = "white";

      base_image.src = 'others/apple_logo.png';
      base_image.onload = () => {
        redraw(img, exifData, base_image, ctx, newWidth, newHeight);
      };
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
  const downloadFileName = `${originalFileName}_kimchi.jpg`;

  // Trigger download of the current canvas content
  const link = document.createElement("a");
  link.href = displayImageCanvas.toDataURL("image/jpeg");
  link.download = downloadFileName;
  link.click();
});

// Add button functionality
container.addEventListener("click", () => {
  console.log(displayImageCanvas.height);
  console.log(displayImageCanvas.width);
});

const menu = document.querySelector('.menu');
const checkbox = document.getElementById('edit');

// Toggle menu visibility when checkbox is checked/unchecked
checkbox.addEventListener('change', function() {
  if (this.checked) {
    menu.style.display = 'flex'; // enable flexbox
    document.getElementById('footer').style.display = 'none';
  } else {
    menu.style.display = 'none'; // Hide
  }
});

// Close menu when clicking outside of it
document.addEventListener('click', function(e) {
  if (!menu.contains(e.target) && !checkbox.contains(e.target)) {
    menu.style.display = 'none'; // Close the menu if clicked outside
    document.getElementById('footer').style.display = 'block';
    checkbox.checked = false;
  }
});

// Logo Boolean
document.querySelectorAll('input[name="displayLogo"]').forEach((radioButton) => {
  radioButton.addEventListener('change', () => {
    if (radioButton.checked) {
      const selectedOption = radioButton.id; // Get the selected radio button's ID
      
      if (uploadedFile) {
        // Trigger canvas redraw
        const aspectRatio = img.width / img.height;
        let newWidth = img.width;
        let newHeight = img.height;

        // Pass additional logic or options based on the selected radio button
        if (selectedOption === 'option-1') {
          console.log("Option 1 selected: Showing base image");
          redraw(img, exifData, base_image, ctx, newWidth, newHeight);
        } else if (selectedOption === 'option-2') {
          console.log("Option 2 selected: Hiding base image");
          redraw(img, exifData, null, ctx, newWidth, newHeight); // Example: No base image
        }
      }
    }
  });
});
