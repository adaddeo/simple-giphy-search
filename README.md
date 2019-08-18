This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Starting Point

I used [create-react-app](https://github.com/facebook/create-react-app) as a starting point. It seemed liked the ideal tool for a "one-off" project like this to get a development server and production build with Typescript and ES6 support with minimal configuration.


### Design Considerations

### react

I used the new Hooks API to build my React components. I wanted to use this project as an  opportunity to evaluate it. I'd be very comfortable writing the component logic using classes as well.

### @giphy/react-components

_@giphy/react-components_ is being used for its `Gif` component. This component 1) removes the GIF from the DOM when it isn't visible in the viewport, allow hundreds of GIFs to be loaded on the page at once with constant client CPU usage and 2) detects WebP support and renders the optimal format for the client's browser. In future work a replacement component could be written, directly swapped in, and this dependency removed, as it currently represents 69KB (24%) of the build size.

### redux-thunk

I used Redux Thunk to be able to access state inside action creators in order to isolate state logic
from component logic.
