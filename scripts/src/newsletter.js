const CONFIG = {
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyBfYSf2cCa6nZyTQXfwhQAL0zHc9WRz40FGUpZ1jeLV7oWzcCtJRWG1PHyh-3NmV-S/exec'
};

const DOM = {
  newsletter: document.getElementById('newsletter')
};

if (DOM.newsletter) {
  DOM.newsletter.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bodyData = new URLSearchParams(formData.entries());
    const formElements = Array.from(DOM.newsletter.elements);

    formElements.forEach(el => el.style.display = 'none');
    DOM.newsletter.classList.add('loader');

    try {
      const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyData
      });

      if (!response.ok) {
        throw new Error(`Status HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 200) {
        DOM.newsletter.reset();
        DOM.newsletter.innerText = 'E-mail cadastrado com sucesso!';
        DOM.newsletter.classList.add('rounded', 'bg-success', 'text-light', 'fw-bold', 'justify-content-center', 'p-2');
      } else {
        throw new Error(`Status HTTP: ${result.status}`);
      }
    } catch (error) {
      dialog(`ERROR!<p>${error.message || error}</p>`, ['rounded', 'bg-light', 'p-4']);
      formElements.forEach(el => el.style.display = 'inline');
    } finally {
      DOM.newsletter.classList.remove('loader');
    }
  };
}
