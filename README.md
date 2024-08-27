# GemSlider

A fast, lightweight, dependency-free, responsive, and feature-rich slider library for creating beautiful carousels and image galleries.

## Quick Start

### Include gem-slider.min.css:

```html
<link rel="stylesheet" href="gem-slider.min.css">
```

### Include GemSlider:

```html
<script src="gem-slider.min.js"></script>
```

### Example HTML:

```html
<div class="gem-slider">
  <div class="gem-track">
    <div class="gem-slide"> 1 </div>
    <div class="gem-slide"> 2 </div>
    <div class="gem-slide"> 3 </div>
    <div class="gem-slide"> 4 </div>
    <div class="gem-slide"> 5 </div>
    <div class="gem-slide"> 6 </div>
  </div>
  <div class="gem-dots"></div>
  <button class="gem-prev">Prev</button>
  <button class="gem-next">Next</button>
</div>
```

### GemSlider Initialization

```javascript
new GemSlider(document.querySelector('.gem-slider'));
```

### GemSlider Initialization w/ full options:

```javascript
new GemSlider(document.querySelector('.gem-slider'), {
  slidesToShow: 3,
  slidesToScroll: 1,
  itemWidth: 300,
  exactWidth: true,
  duration: 0.5,
  dots: '.gem-dots',
  arrows: {
    prev: '.gem-prev',
    next: '.gem-next'
  },
  draggable: true,
  dragVelocity: 1.5,
  easing: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; },
  scrollLock: true,
  scrollLockDelay: 150,
  resizeLock: true,
  rewind: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  centerMode: true,
  infinite: true,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `slidesToShow` | number | 1 | Number of slides to show |
| `slidesToScroll` | number | 1 | Number of slides to scroll |
| `itemWidth` | number | undefined | Fixed width for each item in pixels |
| `exactWidth` | boolean | false | If true, slides won't be resized to fit viewport |
| `duration` | number | 0.5 | Transition duration in seconds |
| `dots` | string | null | Selector for dots container |
| `arrows` | object | `{ prev: null, next: null }` | Selectors for previous and next arrows |
| `draggable` | boolean | true | Enable mouse dragging |
| `dragVelocity` | number | 1.5 | Velocity for mouse dragging |
| `easing` | function | easeInOutQuad | Custom easing function |
| `scrollLock` | boolean | true | Force centering slide after scroll event |
| `scrollLockDelay` | number | 150 | Delay before applying scroll lock |
| `resizeLock` | boolean | true | Force centering slide after resize event |
| `rewind` | boolean | false | Go to the first slide after reaching the last one |
| `autoplay` | boolean | false | Enable autoplay |
| `autoplaySpeed` | number | 3000 | Autoplay speed in milliseconds |
| `pauseOnHover` | boolean | true | Pause autoplay on hover |
| `centerMode` | boolean | false | Center current slide |
| `infinite` | boolean | false | Enable infinite looping |
| `responsive` | array | null | Breakpoints for responsive behavior |

## Methods

### Change options:

```javascript
const slider = new GemSlider(document.querySelector('.gem-slider'));
slider.setOption('slidesToShow', 2);

// Optionally call refresh
slider.refresh();
```

### Navigation:

```javascript
const slider = new GemSlider(document.querySelector('.gem-slider'));
slider.prev(); // Go to previous slide
slider.next(); // Go to next slide
slider.scrollTo(3); // Go to slide index 3
```

### Destroy:

```javascript
const slider = new GemSlider(document.querySelector('.gem-slider'));
slider.destroy();
```

## Events

### Bind event:

```javascript
document.querySelector('.gem-slider').addEventListener('gem-slide-visible', function(event) {
  // `this` is bound to the slider element
  // custom data located at `event.detail`
  console.log('Slide visible:', event.detail.slideIndex);
});
```

Available events:
- `gem-loaded`: Fired when the slider is fully loaded and initialized
- `gem-refresh`: Fired when the slider is refreshed
- `gem-slide-visible`: Fired when a slide becomes visible
- `gem-slide-hidden`: Fired when a slide becomes hidden
- `gem-destroy`: Fired when the slider is destroyed
- `gem-resize`: Fired when the slider is resized

## Browser support

GemSlider should run on all modern browsers. For older browser support, consider adding polyfills for:
- `document.querySelector`
- `Array.from`
- `Object.assign`
- `CustomEvent`

## Styling

GemSlider comes with basic styling. You can customize the appearance by modifying the CSS classes:

- `.gem-slider`: The main container
- `.gem-track`: The track containing all slides
- `.gem-slide`: Individual slide
- `.gem-slide-visible`: Applied to visible slides
- `.gem-dots`: Container for dot navigation
- `.gem-dot`: Individual dot
- `.gem-dot-active`: Active dot
- `.gem-prev`, `.gem-next`: Previous and next arrow buttons

## Advanced Usage

### Custom Easing Function

You can provide a custom easing function to control the sliding animation:

```javascript
new GemSlider(document.querySelector('.gem-slider'), {
  easing: function(t) {
    return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; // easeInOutCubic
  }
});
```

### Responsive Breakpoints

Set different options for various screen sizes:

```javascript
new GemSlider(document.querySelector('.gem-slider'), {
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
```

This documentation provides a comprehensive guide to using the GemSlider library. Users can refer to this documentation to understand how to create different types of sliders, customize their appearance and behavior, and integrate them into their projects.
