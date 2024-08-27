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

## Examples

Here are 10 different examples showcasing the versatility of GemSlider:

### 1. Basic Image Slider

```html
<div class="gem-slider basic-image-slider">
  <div class="gem-track">
    <div class="gem-slide"><img src="image1.jpg" alt="Image 1"></div>
    <div class="gem-slide"><img src="image2.jpg" alt="Image 2"></div>
    <div class="gem-slide"><img src="image3.jpg" alt="Image 3"></div>
  </div>
  <div class="gem-dots"></div>
</div>

<script>
new GemSlider(document.querySelector('.basic-image-slider'), {
  dots: '.gem-dots'
});
</script>
```

### 2. Product Carousel

```html
<div class="gem-slider product-carousel">
  <div class="gem-track">
    <div class="gem-slide">
      <img src="product1.jpg" alt="Product 1">
      <h3>Product 1</h3>
      <p>$19.99</p>
    </div>
    <!-- More product slides -->
  </div>
  <button class="gem-prev">←</button>
  <button class="gem-next">→</button>
</div>

<script>
new GemSlider(document.querySelector('.product-carousel'), {
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: {
    prev: '.gem-prev',
    next: '.gem-next'
  }
});
</script>
```

### 3. Testimonial Slider

```html
<div class="gem-slider testimonial-slider">
  <div class="gem-track">
    <div class="gem-slide">
      <blockquote>"Great product! Highly recommended."</blockquote>
      - John Doe
    </div>
    <!-- More testimonial slides -->
  </div>
  <div class="gem-dots"></div>
</div>

<script>
new GemSlider(document.querySelector('.testimonial-slider'), {
  dots: '.gem-dots',
  autoplay: true,
  autoplaySpeed: 5000
});
</script>
```

### 4. Full-width Hero Slider

```html
<div class="gem-slider hero-slider">
  <div class="gem-track">
    <div class="gem-slide">
      <img src="hero1.jpg" alt="Hero 1">
      <div class="hero-content">
        <h1>Welcome to Our Site</h1>
        <p>Discover amazing features</p>
      </div>
    </div>
    <!-- More hero slides -->
  </div>
</div>

<script>
new GemSlider(document.querySelector('.hero-slider'), {
  arrows: false,
  dots: false,
  autoplay: true,
  autoplaySpeed: 5000
});
</script>
```

### 5. Vertical Content Slider

```html
<div class="gem-slider vertical-slider">
  <div class="gem-track">
    <div class="gem-slide">
      <h3>News Item 1</h3>
      <p>Lorem ipsum dolor sit amet...</p>
    </div>
    <!-- More news items -->
  </div>
</div>

<script>
new GemSlider(document.querySelector('.vertical-slider'), {
  vertical: true,
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 3000
});
</script>
```

### 6. Multi-item Slider

```html
<div class="gem-slider multi-item-slider">
  <div class="gem-track">
    <div class="gem-slide"><img src="item1.jpg" alt="Item 1"></div>
    <!-- More item slides -->
  </div>
  <div class="gem-dots"></div>
</div>

<script>
new GemSlider(document.querySelector('.multi-item-slider'), {
  slidesToShow: 4,
  slidesToScroll: 2,
  dots: '.gem-dots',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
  ]
});
</script>
```

### 7. Fade Effect Slider

```html
<div class="gem-slider fade-slider">
  <div class="gem-track">
    <div class="gem-slide"><img src="fade1.jpg" alt="Fade 1"></div>
    <div class="gem-slide"><img src="fade2.jpg" alt="Fade 2"></div>
    <div class="gem-slide"><img src="fade3.jpg" alt="Fade 3"></div>
  </div>
</div>

<script>
new GemSlider(document.querySelector('.fade-slider'), {
  fade: true,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 3000
});
</script>
```

### 8. Autoplay Slider with Pause on Hover

```html
<div class="gem-slider autoplay-slider">
  <div class="gem-track">
    <div class="gem-slide">Slide 1</div>
    <div class="gem-slide">Slide 2</div>
    <div class="gem-slide">Slide 3</div>
  </div>
</div>

<script>
new GemSlider(document.querySelector('.autoplay-slider'), {
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true
});
</script>
```

### 9. Centered Mode Slider

```html
<div class="gem-slider centered-slider">
  <div class="gem-track">
    <div class="gem-slide"><img src="center1.jpg" alt="Center 1"></div>
    <div class="gem-slide"><img src="center2.jpg" alt="Center 2"></div>
    <div class="gem-slide"><img src="center3.jpg" alt="Center 3"></div>
  </div>
</div>

<script>
new GemSlider(document.querySelector('.centered-slider'), {
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3
});
</script>
```

### 10. Responsive Breakpoint Slider

```html
<div class="gem-slider responsive-slider">
  <div class="gem-track">
    <div class="gem-slide">Slide 1</div>
    <div class="gem-slide">Slide 2</div>
    <div class="gem-slide">Slide 3</div>
    <div class="gem-slide">Slide 4</div>
  </div>
</div>

<script>
new GemSlider(document.querySelector('.responsive-slider'), {
  slidesToShow: 3,
  slidesToScroll: 3,
  arrows: false,
  dots: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
</script>
```

These examples demonstrate various use cases and configurations of GemSlider, showcasing its flexibility and features. You can use these as starting points and customize them further to fit your specific needs.

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
