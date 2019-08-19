### Starting Point

I used [create-react-app](https://github.com/facebook/create-react-app) as a starting point. It seemed liked the ideal tool for a "one-off" project as it let me get started with a development server and production build with Typescript and ES6 support with minimal configuration.


### Design Considerations

#### Dependencies

##### react

I used the new Hooks API to build my React components. I hadn't used it previously but saw this project as a good opportunity to get familiar with and evaluate the new API (I also noticed it was used in the signal-desktop project). I quite liked it. I would be comfortable writing the component logic using classes as well.

##### redux-thunk

I used Redux Thunk so state could be accessed inside action creators. This lead to greater isolation of logic between data and presentation layers and overall simpler components.

##### @giphy/react-components and @giphy/js-fetch-api

_@giphy/react-components_ is being used for its `Gif` component. This component 1) removes the GIF from the DOM when it isn't visible in the viewport, allow hundreds of GIFs to be loaded on the page at once with constant client CPU usage and 2) detects WebP support and renders the optimal format for the client's browser.

_@giphy/js-fetch-api_ is being used to make requests to the Giphy API. Using this library saved me the time of writing out type definitions for the Giphy responses and provided a tested client out-of-the-box.

In future work a replacements could be written, directly swapped in, and these dependencies removed, as they currently represent 23% of the build size.

#### Testing

I used Jest for writing test. The tests are robust for action creators, reducers and selectors. The component tests (written with the help of Enzyme) could be improved to handle all edge cases in future work.

#### UI

The UI is fairly minimal but does work well across a variety of devices and screen sizes (though future work would include more cross-browser testing), and also can dynamically be resized. A few other features I considered supporting but declared "out-of-scope" simply for the sake of time were:
- using the browser History API to support back and forward navigation as gifs are opened and closed,
- updating the url state with the current query so specific result pages could be shared
- a more feature-rich fullscreen viewer (carousel mode for navigation and action buttons such as close, download, copy, share)
- better UX:
  - scrolling back to top on new results on mobile
  - search button on input bar
  - button navigation on fullscreen viewer

Future work would also include accessibility review.
