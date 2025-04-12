!function(t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():window.GemSlider=t()}(function(){
  /**
   * GemSlider - A lightweight, responsive, and feature-rich slider library
   * @param {string|Element} selector - CSS selector or DOM element
   * @param {Object} options - Configuration options
   * @return {Object} GemSlider instance
   * @version 2.0.0
   */
  function t(i,e){
    if(!(this instanceof t))return new t(i,e);
    this.element="string"==typeof i?document.querySelector(i):i;
    if(!this.element) {
      console.error("GemSlider: Element not found");
      return;
    }
    this.options=Object.assign({},t.defaults,e);
    this.init();
  }

  return t.defaults={
    slidesToShow:1,
    slidesToScroll:1,
    itemWidth:void 0,
    exactWidth:!1,
    duration:.5,
    dots:null,
    arrows:{prev:null,next:null},
    draggable:!0,
    dragVelocity:1.5,
    easing:function(t){return t<.5?2*t*t:-1+(4-2*t)*t},
    scrollLock:!0,
    scrollLockDelay:150,
    resizeLock:!0,
    responsive:null,
    rewind:!1,
    autoplay:!1,
    autoplaySpeed:3e3,
    pauseOnHover:!0,
    centerMode:!1,
    infinite:!1,
    lazyLoad: false,
    preloadImages: 1,
    animation: 'slide', // slide, fade, zoom
    thumbnails: null,
    progressBar: false,
    keyboardNavigation: true,
    touchThreshold: 5,
    adaptiveHeight: false,
    accessibility: true,
    rtl: false,
    swipeToSlide: false,
    waitForAnimate: true,
    zIndex: 1000,
    classNames: {
      slider: 'gem-slider',
      track: 'gem-track',
      slide: 'gem-slide',
      slideActive: 'gem-slide-visible',
      dots: 'gem-dots',
      dot: 'gem-dot',
      dotActive: 'gem-dot-active',
      arrow: 'gem-arrow',
      prev: 'gem-prev',
      next: 'gem-next',
      loading: 'gem-loading',
      progressBar: 'gem-progress-bar',
      thumbnails: 'gem-thumbnails',
      thumbnail: 'gem-thumbnail',
      thumbnailActive: 'gem-thumbnail-active'
    }
  },t.prototype={
    init:function(){
      // Set up main elements
      this.track=this.element.querySelector(".gem-track")||this.element.firstElementChild;
      this.slides=Array.from(this.track.children);
      this.slidesCount=this.slides.length;
      this.currentSlide=0;
      this.scrolling=!1;
      this.dragDistance = 0;
      this.touchStartX = 0;
      this.touchStartY = 0;
      
      // Initialize
      this._setA11yAttributes();
      this.bindEvents();
      this.updateLayout();
      this.attachControls();
      this._setupLazyLoad();
      this.setupAutoplay();
      
      // Add loaded class
      this.element.classList.add("gem-loaded");
      
      // Emit loaded event
      this.emit("gem-loaded",{gemSlider:this});
    },
    
    _setA11yAttributes: function() {
      if (!this.options.accessibility) return;
      
      // Add ARIA attributes
      this.element.setAttribute('role', 'region');
      this.element.setAttribute('aria-label', 'carousel');
      this.track.setAttribute('role', 'list');
      
      this.slides.forEach((slide, index) => {
        slide.setAttribute('role', 'listitem');
        slide.setAttribute('aria-hidden', index === this.currentSlide ? 'false' : 'true');
        slide.setAttribute('tabindex', index === this.currentSlide ? '0' : '-1');
      });
    },
    
    _setupLazyLoad: function() {
      if (!this.options.lazyLoad) return;
      
      this.slides.forEach(slide => {
        const images = slide.querySelectorAll('img[data-src]');
        images.forEach(img => {
          img.classList.add('gem-lazy');
          // Add placeholder if needed
          if (!img.src) {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
          }
        });
      });
      
      // Load initial visible slides
      this._loadLazyImages();
    },
    
    _loadLazyImages: function() {
      if (!this.options.lazyLoad) return;
      
      const start = Math.max(0, this.currentSlide - this.options.preloadImages);
      const end = Math.min(this.slidesCount, this.currentSlide + this.options.slidesToShow + this.options.preloadImages);
      
      for (let i = start; i < end; i++) {
        const slide = this.slides[i];
        if (!slide) continue;
        
        const images = slide.querySelectorAll('img.gem-lazy');
        images.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.remove('gem-lazy');
            
            img.addEventListener('load', () => {
              img.classList.add('gem-lazy-loaded');
              if (this.options.adaptiveHeight) {
                this.updateLayout();
              }
            });
          }
        });
      }
    },
    
    bindEvents:function(){
      // Resize event
      this.debouncedResizeHandler = this._debounce(this.handleResize.bind(this), 250);
      window.addEventListener("resize", this.debouncedResizeHandler);
      
      // Keyboard navigation
      if (this.options.keyboardNavigation) {
        this.element.setAttribute('tabindex', '0');
        this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
      }
      
      // Drag events
      if(this.options.draggable){
        // Mouse events
        this.track.addEventListener("mousedown", this.dragStart.bind(this));
        
        // Touch events
        this.track.addEventListener("touchstart", this.dragStart.bind(this), { passive: false });
        
        // Prevent click during drag
        this.track.addEventListener('click', this.handleTrackClick.bind(this), true);
      }
      
      // Visibility change for autoplay
      if (this.options.autoplay) {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      }
    },
    
    handleTrackClick: function(e) {
      // Prevent click if we've dragged significantly
      if (this.clickPrevented) {
        e.stopPropagation();
        e.preventDefault();
        this.clickPrevented = false;
      }
    },
    
    handleKeyDown: function(e) {
      if (!this.options.keyboardNavigation) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          if (!this.options.rtl) {
            this.prev();
          } else {
            this.next();
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (!this.options.rtl) {
            this.next();
          } else {
            this.prev();
          }
          e.preventDefault();
          break;
        case 'Home':
          this.scrollTo(0);
          e.preventDefault();
          break;
        case 'End':
          this.scrollTo(this.slidesCount - this.options.slidesToShow);
          e.preventDefault();
          break;
      }
    },
    
    handleVisibilityChange: function() {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        if (this.options.autoplay && !this.element.matches(':hover') || !this.options.pauseOnHover) {
          this.resumeAutoplay();
        }
      }
    },
    
    handleResize: function() {
      if (!this.options.resizeLock) return;
      this.updateLayout();
      this.emit("gem-resize", {gemSlider: this});
    },
    
    updateLayout:function(){
      // Calculate slide width
      let slideWidth = this.options.exactWidth 
        ? this.options.itemWidth 
        : this.element.clientWidth / this.options.slidesToShow;
      
      // Set slide widths
      this.slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
      });
      
      // Set track width
      this.track.style.width = `${slideWidth * this.slidesCount}px`;
      
      // Center mode padding
      if (this.options.centerMode) {
        this.track.style.padding = `0 ${this.element.clientWidth/2 - slideWidth/2}px`;
      } else {
        this.track.style.padding = '';
      }
      
      // Handle RTL
      if (this.options.rtl) {
        this.track.style.flexDirection = 'row-reverse';
      }
      
      // Adaptive height
      if (this.options.adaptiveHeight) {
        const currentSlide = this.slides[this.currentSlide];
        if (currentSlide) {
          const height = currentSlide.offsetHeight;
          this.track.style.height = `${height}px`;
        }
      }
      
      this.updateSlideVisibility();
    },
    
    attachControls:function(){
      // Create dots
      this.options.dots && this.createDots();
      
      // Create arrows
      this.options.arrows.prev && this.options.arrows.next && this.attachArrows();
      
      // Create progress bar
      this.options.progressBar && this.createProgressBar();
      
      // Create thumbnails
      this.options.thumbnails && this.createThumbnails();
    },
    
    createDots:function(){
      let dotsContainer = document.querySelector(this.options.dots);
      if(!dotsContainer) return;
      
      // Clear existing dots
      dotsContainer.innerHTML = '';
      
      // Create new dots
      for(let i=0; i<this.slidesCount; i++){
        let dot = document.createElement("button");
        dot.classList.add(this.options.classNames.dot);
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', `Go to slide ${i+1}`);
        dot.addEventListener("click", () => this.scrollTo(i));
        dotsContainer.appendChild(dot);
      }
      
      this.dots = dotsContainer.querySelectorAll(`.${this.options.classNames.dot}`);
      this.updateActiveDot();
    },
    
    createProgressBar: function() {
      if (!this.options.progressBar) return;
      
      // Create progress bar container
      const progressContainer = document.createElement('div');
      progressContainer.classList.add(this.options.classNames.progressBar);
      
      // Create progress indicator
      const progressIndicator = document.createElement('span');
      progressContainer.appendChild(progressIndicator);
      
      // Add to slider
      this.element.appendChild(progressContainer);
      
      // Store references
      this.progressBar = {
        container: progressContainer,
        indicator: progressIndicator
      };
      
      // Update progress
      this.updateProgress();
    },
    
    createThumbnails: function() {
      if (!this.options.thumbnails) return;
      
      const thumbnailContainer = document.querySelector(this.options.thumbnails);
      if (!thumbnailContainer) return;
      
      // Clear existing thumbnails
      thumbnailContainer.innerHTML = '';
      thumbnailContainer.classList.add(this.options.classNames.thumbnails);
      
      // Create thumbnails
      this.slides.forEach((slide, index) => {
        const thumbnail = document.createElement('button');
        thumbnail.classList.add(this.options.classNames.thumbnail);
        thumbnail.setAttribute('type', 'button');
        thumbnail.setAttribute('aria-label', `Go to slide ${index+1}`);
        
        // Try to find image in slide
        const slideImg = slide.querySelector('img');
        if (slideImg) {
          const thumbImg = document.createElement('img');
          thumbImg.src = slideImg.dataset.thumbnail || slideImg.src;
          thumbImg.alt = '';
          thumbnail.appendChild(thumbImg);
        }
        
        // Add click event
        thumbnail.addEventListener('click', () => this.scrollTo(index));
        
        // Add to container
        thumbnailContainer.appendChild(thumbnail);
      });
      
      // Store thumbnails
      this.thumbnails = thumbnailContainer.querySelectorAll(`.${this.options.classNames.thumbnail}`);
      
      // Update active thumbnail
      this.updateActiveThumbnail();
    },
    
    updateActiveThumbnail: function() {
      if (!this.thumbnails) return;
      
      this.thumbnails.forEach((thumbnail, index) => {
        const isActive = index === this.currentSlide;
        thumbnail.classList.toggle(this.options.classNames.thumbnailActive, isActive);
        thumbnail.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    },
    
    updateProgress: function() {
      if (!this.progressBar) return;
      
      const progress = (this.currentSlide / (this.slidesCount - 1)) * 100;
      this.progressBar.indicator.style.width = `${progress}%`;
    },
    
    attachArrows:function(){
      let prevArrow = document.querySelector(this.options.arrows.prev);
      let nextArrow = document.querySelector(this.options.arrows.next);
      
      if (prevArrow) {
        prevArrow.setAttribute('aria-label', 'Previous slide');
        prevArrow.setAttribute('type', 'button');
        prevArrow.addEventListener("click", this.prev.bind(this));
      }
      
      if (nextArrow) {
        nextArrow.setAttribute('aria-label', 'Next slide');
        nextArrow.setAttribute('type', 'button');
        nextArrow.addEventListener("click", this.next.bind(this));
      }
    },
    
    dragStart:function(e){
      if(this.scrolling && this.options.waitForAnimate) return;
      
      e.preventDefault();
      
      this.dragging = true;
      this.clickPrevented = false;
      
      // Record start position
      if (e.type === 'touchstart') {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      } else {
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
      }
      
      this.startPosition = this.track.scrollLeft;
      
      // Add event listeners
      document.addEventListener("mousemove", this.dragging.bind(this));
      document.addEventListener("touchmove", this.dragging.bind(this), { passive: false });
      document.addEventListener("mouseup", this.dragEnd.bind(this));
      document.addEventListener("touchend", this.dragEnd.bind(this));
      
      // Add dragging class
      this.track.classList.add('gem-dragging');
      
      // Pause autoplay while dragging
      if (this.options.autoplay) {
        this.pauseAutoplay();
      }
    },
    
    dragging:function(e){
      if(!this.dragging) return;
      
      let currentX, currentY;
      
      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }
      
      // Calculate distance moved
      const deltaX = currentX - this.touchStartX;
      const deltaY = currentY - this.touchStartY;
      
      // If horizontal movement is greater than vertical and greater than threshold
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.options.touchThreshold) {
        e.preventDefault();
        
        // Update track position
        this.track.scrollLeft = this.startPosition - deltaX;
        
        // Store drag distance for click prevention
        this.dragDistance = Math.abs(deltaX);
        
        // If drag distance is significant, prevent click
        if (this.dragDistance > 10) {
          this.clickPrevented = true;
        }
      }
    },
    
    dragEnd:function(e){
      if(!this.dragging) return;
      
      this.dragging = false;
      
      // Remove event listeners
      document.removeEventListener("mousemove", this.dragging);
      document.removeEventListener("touchmove", this.dragging);
      document.removeEventListener("mouseup", this.dragEnd);
      document.removeEventListener("touchend", this.dragEnd);
      
      // Remove dragging class
      this.track.classList.remove('gem-dragging');
      
      // Calculate which slide to go to
      const currentPosition = this.track.scrollLeft;
      const slideWidth = this.slides[0].offsetWidth;
      const moveDistance = currentPosition - this.startPosition;
      
      let slidesToMove = 0;
      
      if (this.options.swipeToSlide) {
        // Move to the closest slide
        slidesToMove = Math.round(moveDistance / slideWidth);
      } else {
        // Only move if drag distance is significant
        if (Math.abs(moveDistance) > slideWidth * 0.2) {
          slidesToMove = moveDistance > 0 ? 
            Math.ceil(moveDistance / slideWidth) : 
            Math.floor(moveDistance / slideWidth);
        }
      }
      
      // Move to the new slide
      this.scrollTo(this.currentSlide - slidesToMove);
      
      // Resume autoplay if needed
      if (this.options.autoplay && !this.element.matches(':hover') || !this.options.pauseOnHover) {
        this.resumeAutoplay();
      }
    },
    
    scrollTo:function(targetIndex){
      if(this.scrolling && this.options.waitForAnimate) return;
      
      this.scrolling = true;
      
      // Calculate actual target index
      let actualIndex = targetIndex;
      
      if (this.options.infinite) {
        // Wrap around for infinite mode
        actualIndex = (targetIndex + this.slidesCount) % this.slidesCount;
      } else if (this.options.rewind) {
        // Rewind to opposite end
        if (targetIndex < 0) {
          actualIndex = this.slidesCount - this.options.slidesToShow;
        } else if (targetIndex >= this.slidesCount) {
          actualIndex = 0;
        } else {
          actualIndex = targetIndex;
        }
      } else {
        // Clamp to valid range
        actualIndex = Math.max(0, Math.min(targetIndex, this.slidesCount - this.options.slidesToShow));
      }
      
      // Calculate target position
      const targetSlide = this.slides[actualIndex];
      if (!targetSlide) {
        this.scrolling = false;
        return;
      }
      
      let targetPosition = targetSlide.offsetLeft;
      
      // Adjust for center mode
      if (this.options.centerMode) {
        targetPosition -= (this.element.clientWidth - targetSlide.offsetWidth) / 2;
      }
      
      // Get current position
      const currentPosition = this.track.scrollLeft;
      const distance = targetPosition - currentPosition;
      
      // Animation timing
      const startTime = performance.now();
      const duration = this.options.duration * 1000;
      
      // Choose animation method based on option
      if (this.options.animation === 'fade') {
        this._animateFade(actualIndex, duration);
      } else {
        // Default slide animation
        const animate = (currentTime) => {
          // Calculate progress
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = this.options.easing(progress);
          
          // Update position
          this.track.scrollLeft = currentPosition + distance * easedProgress;
          
          // Continue animation if not complete
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Animation complete
            this.scrolling = false;
            this.currentSlide = actualIndex;
            
            // Update slide visibility
            this.updateSlideVisibility();
            
            // Update controls
            this.updateActiveDot();
            this.updateActiveThumbnail();
            this.updateProgress();
            
            // Load lazy images if needed
            this._loadLazyImages();
            
            // Emit event
            this.emit("gem-slide-changed", {
              gemSlider: this,
              currentSlide: this.currentSlide,
              previousSlide: targetIndex !== actualIndex ? targetIndex : null
            });
          }
        };
        
        // Start animation
        requestAnimationFrame(animate);
      }
    },
    
    _animateFade: function(targetIndex, duration) {
      // Hide all slides
      this.slides.forEach((slide, index) => {
        if (index !== this.currentSlide && index !== targetIndex) {
          slide.style.opacity = 0;
          slide.style.zIndex = 1;
        }
      });
      
      // Get current and target slides
      const currentSlide = this.slides[this.currentSlide];
      const targetSlide = this.slides[targetIndex];
      
      // Set z-index for proper stacking
      if (currentSlide) {
        currentSlide.style.zIndex = 2;
      }
      
      if (targetSlide) {
        targetSlide.style.opacity = 0;
        targetSlide.style.zIndex = 3;
        
        // Trigger reflow
        void targetSlide.offsetWidth;
        
        // Fade in target slide
        targetSlide.style.transition = `opacity ${duration/1000}s`;
        targetSlide.style.opacity = 1;
        
        // Animation complete handler
        const transitionEnd = () => {
          targetSlide.removeEventListener('transitionend', transitionEnd);
          targetSlide.style.transition = '';
          
          // Update state
          this.scrolling = false;
          this.currentSlide = targetIndex;
          
          // Update slide visibility
          this.updateSlideVisibility();
          
          // Update controls
          this.updateActiveDot();
          this.updateActiveThumbnail();
          this.updateProgress();
          
          // Load lazy images if needed
          this._loadLazyImages();
          
          // Emit event
          this.emit("gem-slide-changed", {
            gemSlider: this,
            currentSlide: this.currentSlide
          });
        };
        
        targetSlide.addEventListener('transitionend', transitionEnd);
      }
    },
    
    prev:function(){
      this.scrollTo(this.currentSlide - this.options.slidesToScroll);
    },
    
    next:function(){
      this.scrollTo(this.currentSlide + this.options.slidesToScroll);
    },
    
    updateSlideVisibility:function(){
      // Update slide visibility and ARIA attributes
      this.slides.forEach((slide, index) => {
        const isVisible = index >= this.currentSlide && 
                          index < this.currentSlide + this.options.slidesToShow;
        
        // Update class
        slide.classList.toggle(this.options.classNames.slideActive, isVisible);
        
        // Update ARIA attributes
        if (this.options.accessibility) {
          slide.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
          slide.setAttribute('tabindex', isVisible ? '0' : '-1');
        }
        
        // Emit events
        if (isVisible) {
          this.emit("gem-slide-visible", {gemSlider: this, slideIndex: index});
        } else {
          this.emit("gem-slide-hidden", {gemSlider: this, slideIndex: index});
        }
      });
    },
    
    updateActiveDot:function(){
      if(!this.dots) return;
      
      this.dots.forEach((dot, index) => {
        const isActive = index === this.currentSlide;
        dot.classList.toggle(this.options.classNames.dotActive, isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    },
    
    setupAutoplay:function(){
      if(!this.options.autoplay) return;
      
      this.autoplayInterval = setInterval(() => {
        // If at the end and not infinite/rewind, go to start
        if (!this.options.infinite && 
            !this.options.rewind && 
            this.currentSlide >= this.slidesCount - this.options.slidesToShow) {
          this.scrollTo(0);
        } else {
          this.next();
        }
      }, this.options.autoplaySpeed);
      
      if(this.options.pauseOnHover) {
        this.element.addEventListener("mouseenter", this.pauseAutoplay.bind(this));
        this.element.addEventListener("mouseleave", this.resumeAutoplay.bind(this));
      }
    },
    
    pauseAutoplay:function(){
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    },
    
    resumeAutoplay:function(){
      if (this.options.autoplay && !this.autoplayInterval) {
        this.setupAutoplay();
      }
    },
    
    _debounce: function(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    },
    
    refresh:function(){
      // Re-initialize slides
      this.slides = Array.from(this.track.children);
      this.slidesCount = this.slides.length;
      
      // Update layout and controls
      this.updateLayout();
      
      // Recreate controls if needed
      if (this.options.dots) {
        this.createDots();
      }
      
      if (this.options.progressBar) {
        this.element.querySelector(`.${this.options.classNames.progressBar}`)?.remove();
        this.createProgressBar();
      }
      
      if (this.options.thumbnails) {
        this.createThumbnails();
      }
      
      // Emit event
      this.emit("gem-refresh", {gemSlider: this});
    },
    
    setOption:function(option, value){
      // Update option
      this.options[option] = value;
      
      // Refresh slider
      this.refresh();
    },
    
    destroy:function(){
      // Clear autoplay
      clearInterval(this.autoplayInterval);
      
      // Remove event listeners
      window.removeEventListener("resize", this.debouncedResizeHandler);
      
      if (this.options.draggable) {
        this.track.removeEventListener("mousedown", this.dragStart);
        this.track.removeEventListener("touchstart", this.dragStart);
        this.track.removeEventListener("click", this.handleTrackClick, true);
      }
      
      if (this.options.keyboardNavigation) {
        this.element.removeEventListener('keydown', this.handleKeyDown);
      }
      
      if (this.options.autoplay && this.options.pauseOnHover) {
        this.element.removeEventListener("mouseenter", this.pauseAutoplay);
        this.element.removeEventListener("mouseleave", this.resumeAutoplay);
      }
      
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      
      // Remove classes
      this.element.classList.remove("gem-loaded");
      
      // Reset slides
      this.slides.forEach(slide => {
        slide.style.width = "";
        slide.style.opacity = "";
        slide.style.zIndex = "";
        slide.classList.remove(this.options.classNames.slideActive);
        
        if (this.options.accessibility) {
          slide.removeAttribute('aria-hidden');
          slide.removeAttribute('tabindex');
          slide.removeAttribute('role');
        }
      });
      
      // Reset track
      this.track.style.width = "";
      this.track.style.padding = "";
      this.track.style.transition = "";
      this.track.style.flexDirection = "";
      this.track.style.height = "";
      
      if (this.options.accessibility) {
        this.track.removeAttribute('role');
        this.element.removeAttribute('role');
        this.element.removeAttribute('aria-label');
        this.element.removeAttribute('tabindex');
      }
      
      // Remove controls
      if (this.options.dots) {
        const dotsContainer = document.querySelector(this.options.dots);
        if (dotsContainer) {
          dotsContainer.innerHTML = "";
        }
      }
      
      if (this.options.progressBar) {
        this.element.querySelector(`.${this.options.classNames.progressBar}`)?.remove();
      }
      
      // Emit event
      this.emit("gem-destroy", {gemSlider: this});
    },
    
    emit:function(eventName, detail){
      const event = new CustomEvent(eventName, {
        bubbles: true,
        detail: detail
      });
      this.element.dispatchEvent(event);
    }
  },t;
});