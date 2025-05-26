document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentIndex = 0;
  const totalSlides = slides.length; 

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides; 
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  let slideInterval = setInterval(nextSlide, 5000);
  const carousel = document.querySelector('.reviews-carousel');
  
  carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
  carousel.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });

  showSlide(0); 
});