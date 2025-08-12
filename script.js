class ContactFormValidator {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            subject: document.getElementById('subject'),
            message: document.getElementById('message'),
            newsletter: document.getElementById('newsletter')
        };
        this.errors = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            phone: document.getElementById('phoneError'),
            subject: document.getElementById('subjectError'),
            message: document.getElementById('messageError')
        };
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.charCount = document.getElementById('charCount');
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.setupCharacterCounter();
    }

    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            if (this.fields[fieldName] && fieldName !== 'newsletter') {
                this.fields[fieldName].addEventListener('blur', () => this.validateField(fieldName));
                this.fields[fieldName].addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });

        // Phone number formatting
        this.fields.phone.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }

    setupCharacterCounter() {
        this.fields.message.addEventListener('input', () => {
            const currentLength = this.fields.message.value.length;
            const maxLength = 500;
            this.charCount.textContent = `${currentLength}/${maxLength} characters`;
            
            // Update color based on character count
            this.charCount.classList.remove('warning', 'error');
            if (currentLength > maxLength * 0.8) {
                this.charCount.classList.add('warning');
            }
            if (currentLength > maxLength) {
                this.charCount.classList.add('error');
            }
        });
    }

    formatPhoneNumber(e) {
        // Simple phone number formatting (US format)
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 10) {
            value = value.substring(0, 10);
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})/, '($1)');
        }
        e.target.value = value;
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;

            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Subject must be at least 3 characters long';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                } else if (value.length > 500) {
                    errorMessage = 'Message cannot exceed 500 characters';
                    isValid = false;
                }
                break;
        }

        this.showFieldError(fieldName, errorMessage);
        this.updateFieldStyle(field, isValid);
        return isValid;
    }

    isValidEmail(email) {
        // Comprehensive email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10;
    }

    showFieldError(fieldName, message) {
        if (this.errors[fieldName]) {
            this.errors[fieldName].textContent = message;
        }
    }

    clearFieldError(fieldName) {
        if (this.errors[fieldName]) {
            this.errors[fieldName].textContent = '';
        }
        this.updateFieldStyle(this.fields[fieldName], null);
    }

    updateFieldStyle(field, isValid) {
        field.classList.remove('error', 'success');
        if (isValid === true) {
            field.classList.add('success');
        } else if (isValid === false) {
            field.classList.add('error');
        }
    }

    validateAllFields() {
        let isFormValid = true;
        const requiredFields = ['name', 'email', 'subject', 'message'];
        
        requiredFields.forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isFormValid = false;
            }
        });

        // Validate optional phone field if filled
        if (this.fields.phone.value.trim()) {
            if (!this.validateField('phone')) {
                isFormValid = false;
            }
        }

        return isFormValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Hide success message if visible
        this.successMessage.style.display = 'none';

        // Validate all fields
        if (!this.validateAllFields()) {
            this.showSubmissionError('Please correct the errors above before submitting.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call
            await this.simulateFormSubmission();
            
            // Show success
            this.showSuccess();
            
        } catch (error) {
            this.showSubmissionError('There was an error sending your message. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        this.submitBtn.disabled = isLoading;
        this.submitBtn.querySelector('.btn-text').style.display = isLoading ? 'none' : 'inline';
        this.submitBtn.querySelector('.btn-loading').style.display = isLoading ? 'inline' : 'none';
    }

    simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }

    showSuccess() {
        // Hide form and show success message
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Reset form after a delay
        setTimeout(() => {
            this.resetForm();
        }, 5000);
    }

    showSubmissionError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.submission-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'submission-error';
            errorDiv.style.cssText = `
                background: #f8d7da;
                color: #721c24;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #f5c6cb;
                text-align: center;
            `;
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        errorDiv.textContent = message;
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        // Clear all errors and styles
        Object.keys(this.fields).forEach(fieldName => {
            if (this.fields[fieldName] && fieldName !== 'newsletter') {
                this.clearFieldError(fieldName);
            }
        });
        
        // Reset character counter
        this.charCount.textContent = '0/500 characters';
        this.charCount.classList.remove('warning', 'error');
    }
}

// Initialize the form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormValidator();
});

// Additional utility functions for testing
window.FormTestUtils = {
    fillValidData: () => {
        document.getElementById('name').value = 'John Doe';
        document.getElementById('email').value = 'john.doe@example.com';
        document.getElementById('phone').value = '(555) 123-4567';
        document.getElementById('subject').value = 'Test Subject';
        document.getElementById('message').value = 'This is a test message with enough characters to pass validation.';
    },
    
    fillInvalidData: () => {
        document.getElementById('name').value = 'J';
        document.getElementById('email').value = 'invalid-email';
        document.getElementById('phone').value = '123';
        document.getElementById('subject').value = 'Hi';
        document.getElementById('message').value = 'Short';
    },
    
    testSpecialCharacters: () => {
        document.getElementById('name').value = 'José María O\'Connor-Smith';
        document.getElementById('email').value = 'test.email+tag@example-domain.com';
        document.getElementById('subject').value = 'Special chars: àáâãäåæçèéêëìíîï';
        document.getElementById('message').value = 'Testing special characters: ñóôõö÷øùúûüýþÿ and emojis 🚀📧✨';
    }
};
