Generating colorspace
---

Source to the background image used primarly for the rgb colorspace.
When making adjustments to this source, export the image as a png and run

    openssl enc -base64 -in /path/to/rgb-colorspace.png | tr -d '\n' | pbcopy

What's copied should replace the encoded image defined in `react-colorpickr.css`.
