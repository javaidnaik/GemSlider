# GemSlider v2.0.0

A fast, lightweight, dependency-free, responsive, and feature-rich slider library for creating beautiful carousels, image galleries, and content sliders.

## Features

- **Fully Responsive** - Works on all devices and screen sizes
- **Lightweight** - No dependencies, minimal footprint
- **Multiple Animation Types** - Slide, fade, and zoom effects
- **Lazy Loading** - Load images only when needed for better performance
- **Accessibility** - ARIA attributes and keyboard navigation
- **Touch & Swipe** - Enhanced touch and swipe support
- **Infinite Loop** - Seamless infinite scrolling option
- **Autoplay** - With customizable speed and pause on hover
- **Center Mode** - Focus on the center slide
- **Progress Bar** - Visual indicator of autoplay progress
- **RTL Support** - Right-to-left language support
- **Thumbnails** - Optional thumbnail navigation
- **Vertical Mode** - Support for vertical sliders
- **Dynamic Content** - Add or remove slides dynamically
- **API** - Rich API for programmatic control

## Quick Start

### Include gemslider.css:

```html
<link rel="stylesheet" href="gemslider.css">
```

### Include GemSlider:

```html
<script src="gemslider.js"></script>
```

### Basic Example HTML:

```html
<div class="gem-slider">
  <div class="gem-track">
    <div class="gem-slide"><img src="image1.jpg" alt="Image 1"></div>
    <div class="gem-slide"><img src="image2.jpg" alt="Image 2"></div>
    <div class="gem-slide"><img src="image3.jpg" alt="Image 3"></div>
  </div>
  <div class="gem-dots"></div>
</div>
```

### GemSlider Initialization

```javascript
new GemSlider(document.querySelector('.gem-slider'), {
  // options
});
```

## Lazy Loading

For better performance, use the lazy loading feature:

```html
<div class="gem-slider">
  <div class="gem-track">
    <div class="gem-slide"><img data-src="image1.jpg" alt="Image 1"></div>
    <div class="gem-slide"><img data-src="image2.jpg" alt="Image 2"></div>
    <div class="gem-slide"><img data-src="image3.jpg" alt="Image 3"></div>
  </div>
</div>

<script>
new GemSlider(document.querySelector('.gem-slider'), {
  lazyLoad: true
});
</script>
```

## Animation Options

GemSlider supports multiple animation types:

```javascript
// Slide animation (default)
new GemSlider(element, {
  animation: 'slide'
});

// Fade animation
new GemSlider(element, {
  animation: 'fade'
});

// Zoom animation
new GemSlider(element, {
  animation: 'zoom'
});
```

## Multiple Items

Display multiple items at once:

```javascript
new GemSlider(element, {
  slidesToShow: 3,
  slidesToScroll: 1
});
```

## Responsive Options

Customize behavior at different breakpoints:

```javascript
new GemSlider(element, {
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
```

## Vertical Mode

Create a vertical slider:

```javascript
new GemSlider(element, {
  vertical: true,
  slidesToShow: 3
});
```

## Thumbnails

Add thumbnail navigation:

```html
<div class="gem-slider">
  <div class="gem-track">
    <!-- Slides -->
  </div>
  <div class="gem-thumbnails"></div>
</div>

<script>
new GemSlider(element, {
  thumbnails: '.gem-thumbnails'
});
</script>
```

## Progress Bar

Add a progress bar for autoplay:

```javascript
new GemSlider(element, {
  autoplay: true,
  autoplaySpeed: 3000,
  progressBar: true
});
```

## API Methods

GemSlider provides a rich API for programmatic control:

```javascript
const slider = new GemSlider(element, options);

// Navigation
slider.prev();
slider.next();
slider.scrollTo(index);

// Autoplay
slider.pauseAutoplay();
slider.resumeAutoplay();

// Update options
slider.setOption('slidesToShow', 2);

// Refresh slider
slider.refresh();

// Destroy slider
slider.destroy();
```

## Events

Listen for slider events:

```javascript
const slider = document.querySelector('.gem-slider');

slider.addEventListener('gem-slide-changed', function(event) {
  console.log('Slide changed to:', event.detail.currentSlide);
});

slider.addEventListener('gem-loaded', function(event) {
  console.log('Slider loaded:', event.detail.gemSlider);
});
```

## All Configuration Options

```javascript
{
  slidesToShow: 1,
  slidesToScroll: 1,
  itemWidth: undefined,
  exactWidth: false,
  duration: 0.5,
  dots: null,
  arrows: {
    prev: null,
    next: null
  },
  draggable: true,
  dragVelocity: 1.5,
  easing: function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  scrollLock: true,
  scrollLockDelay: 150,
  resizeLock: true,
  responsive: null,
  rewind: false,
  autoplay: false,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  centerMode: false,
  infinite: false,
  lazyLoad: false,
  preloadImages: 1,
  animation: 'slide',
  thumbnails: null,
  progressBar: false,
  keyboardNavigation: true,
  touchThreshold: 5,
  adaptiveHeight: false,
  accessibility: true,
  rtl: false,
  swipeToSlide: false,
  waitForAnimate: true,
  zIndex: 1000
}
```

## Examples

Check out the examples directory for various implementations:

- Basic slider
- Autoplay with progress bar
- Centered mode
- Fade effect
- Full-width hero slider
- Multi-item carousel
- Vertical content slider
- Product showcase
- Responsive gallery
- Testimonial slider

## Browser Support

GemSlider works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

MIT License
