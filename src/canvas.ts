const canvas: HTMLCanvasElement = document.createElement('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

// Load images
const img1: HTMLImageElement = new Image();
const img2: HTMLImageElement = new Image();

img1.onload = function() {
    // Draw the first image
    ctx.drawImage(img1, 0, 0);

    img2.onload = function() {
        // Draw the second image
        ctx.drawImage(img2, img1.width, 0);

        // Add some text
        ctx.font = '30px Arial';
        ctx.fillText('Your text here', 10, 50);

        // Now you can save the composed image
        const dataURL: string = canvas.toDataURL('image/png');
        // do something with dataURL
    };
    img2.src = 'path/to/image2.png';
};
img1.src = 'path/to/image1.png';