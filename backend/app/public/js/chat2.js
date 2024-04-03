const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');

colors.forEach(function(color) {
  color.addEventListener('click', function(e) {
    colors.forEach(function(c) {
      c.classList.remove('selected');
    });
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    color.classList.add('selected');
  });
});

toggleButton.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
});
