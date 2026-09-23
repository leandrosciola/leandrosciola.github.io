const DOM = {
  header: document.querySelector('header'),
  hero: document.querySelector('header .hero'),
  mainContainer: document.querySelector('main .container')
};

const showContent = (id) => {
  DOM.header?.classList.remove('min-vh-100');
  DOM.hero?.classList.add('d-none');
  
  const contentTemplate = document.getElementById(id);

  if (DOM.mainContainer && contentTemplate) {
    DOM.mainContainer.innerHTML = contentTemplate.innerHTML;
  }

  window.scrollTo({ top: 0 });
};

const toggleProfile = () => {
  const viewProfile = document.getElementById('view-profile');
  const profile = document.getElementById('profile');

  if (!viewProfile || !profile) {
    return;
  }

  const isActive = viewProfile.classList.toggle('active');
  profile.classList.toggle('d-none', isActive);
  viewProfile.classList.toggle('d-none', !isActive);

  if (isActive) {
    window.scrollTo({ top: 0 });
  } else {
    const headerTopHeight = document.querySelector('header .header-top')?.offsetHeight || 0;
    profile.scrollIntoView({ block: 'start' });
    window.scrollTo({ top: window.scrollY - headerTopHeight - 10 });
  }
};

const buttons = document.querySelectorAll('.toggle-profile');

buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    toggleProfile();
  });
});

document.querySelector('.privacy-policy').addEventListener('click', (event) => {
  event.preventDefault();
  showContent('privacy-policy');
});
