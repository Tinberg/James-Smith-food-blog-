// Form validation for index.html and contact.html
document.addEventListener("DOMContentLoaded", function () {
  const newsletterForm = document.getElementById("newsletterForm");
  const contactForm = document.getElementById("contactForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      validateForm(event, "newsletter");
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      validateForm(event, "contact");
    });
  }
  // this function prevent if there are missing characters or invalid email. it creates text for each input/texerea, at the end it redriect the user if everything in the form is validateForm.
  function validateForm(event, formType) {
    let hasError = false;

    const nameInput = formType === "newsletter" ? "name" : "contactName";
    const emailInput = formType === "newsletter" ? "email" : "contactEmail";
    const name = event.target.querySelector(`#${nameInput}`).value;
    const email = event.target.querySelector(`#${emailInput}`).value;

    // Validate name for both
    if (name.length <= 5) {
      event.target.querySelector(`#${nameInput}Error`).innerText =
        "Name must be more than 5 characters long.";
      hasError = true;
    } else {
      event.target.querySelector(`#${nameInput}Error`).innerText = "";
    }

    // Validate email for both
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      event.target.querySelector(`#${emailInput}Error`).innerText =
        "Please provide a valid email address.";
      hasError = true;
    } else {
      event.target.querySelector(`#${emailInput}Error`).innerText = "";
    }

    // Validation subject and message for contact
    if (formType === "contact") {
      const subject = event.target.querySelector("#contactSubject").value;
      const message = event.target.querySelector("#contactMessage").value;

      if (subject.length <= 15) {
        event.target.querySelector("#contactSubjectError").innerText =
          "Subject must be more than 15 characters long.";
        hasError = true;
      } else {
        event.target.querySelector("#contactSubjectError").innerText = "";
      }

      if (message.length <= 25) {
        event.target.querySelector("#contactMessageError").innerText =
          "Message must be more than 25 characters long.";
        hasError = true;
      } else {
        event.target.querySelector("#contactMessageError").innerText = "";
      }
    }

    // Validation and redirection for both forms
    if (hasError) {
      event.preventDefault();
    } else {
      if (formType === "newsletter") {
        window.location.href = "/html/newsletter-thank-you.html";
      } else if (formType === "contact") {
        window.location.href = "/html/contact-thank-you.html";
      }
      event.preventDefault();
    }
  }
});

//plugin or this? trenger også async pga fetch
//Save message in Endpoint API
function submitContactForm() {
  const formData = {
    name: document.getElementById('contactName').value,
    email: document.getElementById('contactEmail').value,
    subject: document.getElementById('contactSubject').value,
    message: document.getElementById('contactMessage').value,
  };

  fetch('https://james-smith.cmsbackendsolutions.com/wp-json/wp/v1/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
   
    window.location.href = '/html/contact-thank-you.html';
  })
  .catch(error => {
    console.error('Error:', error);
    
  });
}