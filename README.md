This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Design Considerations

The `Gif` component is used from _@giphy/react-components_. This component 1) removes the
GIF from the DOM when it isn't visible in the viewport, allow hundreds of GIFs to be loaded
on the page at once with constant client CPU usage and 2) detects WebP support and renders
the optimal format for the client's browser. In future work a replacement component could
be written, directly swapped in, and this dependency removed.
