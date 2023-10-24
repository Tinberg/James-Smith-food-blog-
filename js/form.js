//Form validation for index.html and contact.html
document.addEventListener("DOMContentLoaded", function () {
    
    const newsletterForm = document.getElementById("newsletterForm");
    const contactForm = document.getElementById("contactForm");

    newsletterForm.addEventListener("submit", function(event) {
        validateForm(event, "newsletter");
    });

    contactForm.addEventListener("submit", function(event) {
        validateForm(event, "contact");
    });

    function validateForm(event, formType) {
        let hasError = false;

        // Name for both
        const name = event.target.querySelector("[name='username']").value;
        if (name.length <= 5) {
            event.target.querySelector("#nameError").innerText = "Name must be more than 5 characters long.";
            hasError = true;
        } else {
            event.target.querySelector("#nameError").innerText = "";
        }

        // Email for both
        const email = event.target.querySelector("[name='useremail']").value;
        const emailPattern = /^[a-åA-Å0-9._%+-]+@[a-åA-Å0-9.-]+\.[a-åA-Å]{2,}$/;
        if (!emailPattern.test(email)) {
            event.target.querySelector("#emailError").innerText = "Please provide a valid email address.";
            hasError = true;
        } else {
            event.target.querySelector("#emailError").innerText = "";
        }

        // Subject and message for contact
        if (formType === "contact") {
            const subject = event.target.querySelector("[name='subject']").value;
            const message = event.target.querySelector("[name='message']").value;

            if (subject.length <= 15) {
                event.target.querySelector("#subjectError").innerText = "Subject must be more than 15 characters long.";
                hasError = true;
            } else {
                event.target.querySelector("#subjectError").innerText = "";
            }

            if (message.length <= 25) {
                event.target.querySelector("#messageError").innerText = "Message must be more than 25 characters long.";
                hasError = true;
            } else {
                event.target.querySelector("#messageError").innerText = "";
            }
        }
        // Validation and redirection for both
        if (hasError) {
            event.preventDefault();
        } else {
            if (formType === "newsletter") {
                window.location.href = 'newsletter-thank-you.html';
            } else if (formType === "contact") {
                window.location.href = 'contact-thank-you.html';
            }
            event.preventDefault(); 
        }
    }
});
