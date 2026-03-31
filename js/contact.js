document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const sendBtn = document.getElementById('sendBtn');
      const formMessage = document.getElementById('formMessage');

      const formData = {
        from_name: document.getElementById('nom').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        subject: document.getElementById('sujet').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      if (!formData.from_name || !formData.from_email || !formData.subject || !formData.message) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
      }

      sendBtn.classList.add('sending');
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span>Envoi en cours...</span>';

      if (typeof emailjs === 'undefined') {
        showMessage('EmailJS n\'est pas configuré. Veuillez vérifier votre configuration.', 'error');
        resetButton();
        return;
      }

      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        .then(function(response) {
          showMessage('Message envoyé avec succès !', 'success');
          contactForm.reset();
          sendBtn.classList.remove('sending');
          sendBtn.classList.add('sent');
          sendBtn.innerHTML = '<span>Message envoyé ✓</span>';

          setTimeout(function() {
            resetButton();
          }, 3000);
        }, function(error) {
          showMessage('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
          resetButton();
        });
    });
  }

  function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.hidden = false;
      formMessage.className = 'form-message';

      if (type === 'success') {
        formMessage.classList.add('field-success');
      } else {
        formMessage.classList.add('field-error');
      }

      setTimeout(function() {
        formMessage.hidden = true;
      }, 5000);
    }
  }

  function resetButton() {
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.classList.remove('sending', 'sent');
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span>Envoyer le message</span>';
    }
  }
});
