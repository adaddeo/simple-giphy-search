### Starting Point

I used [create-react-app](https://github.com/facebook/create-react-app) as a starting point. It seemed liked the ideal tool for a "one-off" project as it let me get started with a development server and production build with Typescript and ES6 support with minimal configuration.


### Design Considerations

#### Dependencies

##### react

I used the new Hooks API to build my React components. I hadn't used it previously but saw this project as a good opportunity to get familiar with and evaluate the new API (I also noticed it was used in the signal-desktop project). I quite liked it. I would be comfortable writing the component logic using classes as well.

##### redux-thunk

I used Redux Thunk to be able to access state inside action creators. I wanted to isolate as much logic between data and presentation layers as possible and I think this did a good job of leading to simpler components.

##### @giphy/react-components

_@giphy/react-components_ is being used for its `Gif` component. This component 1) removes the GIF from the DOM when it isn't visible in the viewport, allow hundreds of GIFs to be loaded on the page at once with constant client CPU usage and 2) detects WebP support and renders the optimal format for the client's browser. In future work a replacement component could be written, directly swapped in, and this dependency removed, as it currently represents 69KB (23%) of the build size.

#### Testing

I wrote fairly robust tests for action creators, reducers and selectors. Test written for components are not as strong at this point.

#### UI

The UI is fairly minimal. A couple other features I considered supporting but decided were "out-of-scope" were supporting back/forward when opening and closing gifs, and a more feature-rich fullscreen viwer (carousel mode for navigation and action buttons such as close, download, copy, share).
