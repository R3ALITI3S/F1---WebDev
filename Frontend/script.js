const http = require("http");
const fs = require("fs");
const path = require("path");

// This points to the absolute path of your 'pages' folder
const basePath = path.join(__dirname, "pages");

const server = http.createServer((req, res) => {
    // 1. Clean the URL
    // This removes the extra "Frontend/pages" part if the browser sends it
    let relativePath = req.url.replace(/^\/Frontend\/pages/i, "");

    // 2. Handle the root/homepage
    if (relativePath === "/" || relativePath === "") {
        relativePath = "/homePage.html";
    }

    // 3. Resolve the physical file path
    let filePath = path.join(basePath, relativePath);

    // 4. Auto-append .html if there's no extension (for links like /drivers)
    const extname = path.extname(filePath).toLowerCase();
    if (!extname && !filePath.endsWith("/")) {
        filePath += ".html";
    }

    // 5. Determine Content-Type
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".avif": "image/avif",
        ".webp": "image/webp",
    };

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";

    // 6. Serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log("❌ Not Found:", filePath); // No images were found :(

            // Serve 404 page
            const errorPage = path.join(basePath, "404.html");
            fs.readFile(errorPage, (err404, data404) => {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(data404 || "404 Not Found");
            });
        } else {
            console.log("✅ Serving:", filePath); // IMAGES WERE FOUND!
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});