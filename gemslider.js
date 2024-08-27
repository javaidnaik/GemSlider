(function (factory) {
    if (typeof define === 'function' && define.amd) {
      define(factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      window.GemSlider = factory();
    }
  }(function () {
  
    function GemSlider(element, options) {
      if (!(this instanceof GemSlider)) {
        return new GemSlider(element, options);
      }
      
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      this.options = Object.assign({}, GemSlider.defaults, options);
  
      this.init();
    }
  
    GemSlider.defaults = {
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
      easing: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; }, // easeInOutQuad
      scrollLock: true,
      scrollLockDelay: 150,
      resizeLock: true,
      responsive: null,
      rewind: false,
      autoplay: false,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      centerMode: false,
      infinite: false
    };
  
    GemSlider.prototype = {
      init: function () {
        this.track = this.element.querySelector('.gem-track') || this.element.firstElementChild;
        this.slides = Array.from(this.track.children);
        this.slidesCount = this.slides.length;
  
        this.currentSlide = 0;
        this.scrolling = false;
  
        this.bindEvents();
        this.updateLayout();
        this.attachControls();
        this.setupAutoplay();
  
        this.element.classList.add('gem-loaded');
        this.emit('gem-loaded', { gemSlider: this });
      },
  
      bindEvents: function () {
        window.addEventListener('resize', this.debouncedResize.bind(this));
        if (this.options.draggable) {
          this.track.addEventListener('mousedown', this.dragStart.bind(this));
          this.track.addEventListener('touchstart', this.dragStart.bind(this));
        }
      },
  
      updateLayout: function () {
        const itemWidth = this.options.exactWidth ? this.options.itemWidth : this.element.clientWidth / this.options.slidesToShow;
        this.slides.forEach(slide => {
          slide.style.width = `${itemWidth}px`;
        });
        this.track.style.width = `${itemWidth * this.slidesCount}px`;
  
        if (this.options.centerMode) {
          this.track.style.padding = `0 ${this.element.clientWidth / 2 - itemWidth / 2}px`;
        }
  
        this.updateSlideVisibility();
      },
  
      attachControls: function () {
        if (this.options.dots) {
          this.createDots();
        }
        if (this.options.arrows.prev && this.options.arrows.next) {
          this.attachArrows();
        }
      },
  
      createDots: function () {
        const dotsContainer = document.querySelector(this.options.dots);
        if (!dotsContainer) return;
  
        for (let i = 0; i < this.slidesCount; i++) {
          const dot = document.createElement('button');
          dot.classList.add('gem-dot');
          dot.addEventListener('click', () => this.scrollTo(i));
          dotsContainer.appendChild(dot);
        }
        this.dots = dotsContainer.querySelectorAll('.gem-dot');
        this.updateActiveDot();
      },
  
      attachArrows: function () {
        const prevArrow = document.querySelector(this.options.arrows.prev);
        const nextArrow = document.querySelector(this.options.arrows.next);
  
        if (prevArrow) {
          prevArrow.addEventListener('click', this.prev.bind(this));
        }
        if (nextArrow) {
          nextArrow.addEventListener('click', this.next.bind(this));
        }
      },
  
      dragStart: function (e) {
        if (this.scrolling) return;
        
        this.dragging = true;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        this.startPosition = this.track.scrollLeft;
  
        document.addEventListener('mousemove', this.dragging.bind(this));
        document.addEventListener('touchmove', this.dragging.bind(this));
        document.addEventListener('mouseup', this.dragEnd.bind(this));
        document.addEventListener('touchend', this.dragEnd.bind(this));
      },
  
      dragging: function (e) {
        if (!this.dragging) return;
  
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
        const moveX = x - this.startX;
        const moveY = y - this.startY;
  
        if (Math.abs(moveX) > Math.abs(moveY)) {
          e.preventDefault();
          this.track.scrollLeft = this.startPosition - moveX;
        }
      },
  
      dragEnd: function () {
        this.dragging = false;
        document.removeEventListener('mousemove', this.dragging);
        document.removeEventListener('touchmove', this.dragging);
        document.removeEventListener('mouseup', this.dragEnd);
        document.removeEventListener('touchend', this.dragEnd);
  
        const endPosition = this.track.scrollLeft;
        const slideWidth = this.slides[0].offsetWidth;
        const slidesMoved = Math.round((endPosition - this.startPosition) / slideWidth);
  
        this.scrollTo(this.currentSlide + slidesMoved);
      },
  
      scrollTo: function (slideIndex) {
        if (this.scrolling) return;
  
        this.scrolling = true;
        let targetIndex = slideIndex;
  
        if (this.options.infinite) {
          targetIndex = (slideIndex + this.slidesCount) % this.slidesCount;
        } else if (this.options.rewind) {
          targetIndex = slideIndex < 0 ? this.slidesCount - 1 : (slideIndex >= this.slidesCount ? 0 : slideIndex);
        } else {
          targetIndex = Math.max(0, Math.min(slideIndex, this.slidesCount - 1));
        }
  
        const targetPosition = this.slides[targetIndex].offsetLeft - (this.options.centerMode ? (this.element.clientWidth - this.slides[targetIndex].offsetWidth) / 2 : 0);
        const startPosition = this.track.scrollLeft;
        const distance = targetPosition - startPosition;
  
        const startTime = performance.now();
        const animate = (currentTime) => {
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / (this.options.duration * 1000), 1);
          const easeProgress = this.options.easing(progress);
          
          this.track.scrollLeft = startPosition + distance * easeProgress;
  
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.scrolling = false;
            this.currentSlide = targetIndex;
            this.updateSlideVisibility();
            this.updateActiveDot();
            this.emit('gem-slide-visible', { gemSlider: this, slideIndex: this.currentSlide });
          }
        };
  
        requestAnimationFrame(animate);
      },
  
      prev: function () {
        this.scrollTo(this.currentSlide - this.options.slidesToScroll);
      },
  
      next: function () {
        this.scrollTo(this.currentSlide + this.options.slidesToScroll);
      },
  
      updateSlideVisibility: function () {
        this.slides.forEach((slide, index) => {
          const isVisible = index >= this.currentSlide && index < this.currentSlide + this.options.slidesToShow;
          slide.classList.toggle('gem-slide-visible', isVisible);
          if (isVisible) {
            this.emit('gem-slide-visible', { gemSlider: this, slideIndex: index });
          } else {
            this.emit('gem-slide-hidden', { gemSlider: this, slideIndex: index });
          }
        });
      },
  
      updateActiveDot: function () {
        if (!this.dots) return;
        this.dots.forEach((dot, index) => {
          dot.classList.toggle('gem-dot-active', index === this.currentSlide);
        });
      },
  
      setupAutoplay: function () {
        if (!this.options.autoplay) return;
  
        this.autoplayInterval = setInterval(() => {
          if (!this.options.infinite && this.currentSlide >= this.slidesCount - this.options.slidesToShow) {
            this.scrollTo(0);
          } else {
            this.next();
          }
        }, this.options.autoplaySpeed);
  
        if (this.options.pauseOnHover) {
          this.element.addEventListener('mouseenter', this.pauseAutoplay.bind(this));
          this.element.addEventListener('mouseleave', this.resumeAutoplay.bind(this));
        }
      },
  
      pauseAutoplay: function () {
        clearInterval(this.autoplayInterval);
      },
  
      resumeAutoplay: function () {
        this.setupAutoplay();
      },
  
      debouncedResize: function () {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.updateLayout();
          this.emit('gem-resize', { gemSlider: this });
        }, 250);
      },
  
      refresh: function () {
        this.updateLayout();
        this.emit('gem-refresh', { gemSlider: this });
      },
  
      setOption: function (name, value) {
        this.options[name] = value;
        this.refresh();
      },
  
      destroy: function () {
        clearInterval(this.autoplayInterval);
        window.removeEventListener('resize', this.debouncedResize);
        this.track.removeEventListener('mousedown', this.dragStart);
        this.track.removeEventListener('touchstart', this.dragStart);
        this.element.classList.remove('gem-loaded');
        // Remove added styles and classes
        this.slides.forEach(slide => {
          slide.style.width = '';
          slide.classList.remove('gem-slide-visible');
        });
        this.track.style.width = '';
        this.track.style.padding = '';
        // Remove dots if they were created
        if (this.options.dots) {
          const dotsContainer = document.querySelector(this.options.dots);
          if (dotsContainer) dotsContainer.innerHTML = '';
        }
        this.emit('gem-destroy', { gemSlider: this });
      },
  
      emit: function (name, detail) {
        const e = new CustomEvent(name, {
          bubbles: true,
          detail: detail
        });
        this.element.dispatchEvent(e);
      }
    };
  
    return GemSlider;
  }));