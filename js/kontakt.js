// kuhryshev/js/kontakt.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const contactWrapper = document.getElementById('contact-wrapper');
    const responseMessageContainer = document.getElementById('response-message');
    const responseTitle = document.getElementById('response-title');
    const responseText = document.getElementById('response-text');

    // Твои данные из Supabase
    const supabaseUrl = 'https://cjvynohibfrtfnzchiof.supabase.co/functions/v1/send-contact-email';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdnlub2hpYmZydGZuemNoaW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDg2ODgsImV4cCI6MjA3MDQyNDY4OH0.Gf4hjxCdlr4_rMYCqVmERb_w0CrEeGv0geQFiY8nXnY';

    const validateField = (field) => {
        // Убедимся, что у поля есть следующий элемент для ошибки
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (!errorDiv) return true;

        let isValid = true;
        errorDiv.textContent = ''; // Сбрасываем ошибку

        if (field.hasAttribute('required') && !field.value.trim()) {
            errorDiv.textContent = 'Toto pole je povinné.';
            isValid = false;
        } else if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            errorDiv.textContent = 'Zadejte platný e-mail.';
            isValid = false;
        }
        return isValid;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Валидация всех полей
        const fields = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        // --- Состояние загрузки ---
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader"></span> Odesílání...';
        // Сбрасываем предыдущие сообщения об ошибках
        responseMessageContainer.style.display = 'none';

        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value,
        };

        try {
            const response = await fetch(supabaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseAnonKey,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Если статус ответа не 2xx, получаем ошибку из тела
                const errorResult = await response.json();
                throw new Error(errorResult.error || `Chyba serveru: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                // --- Обработка успеха ---
                contactWrapper.style.transition = 'opacity 0.5s ease-out';
                contactWrapper.style.opacity = '0';
                
                setTimeout(() => {
                    contactWrapper.style.display = 'none';
                    responseTitle.textContent = 'Zpráva úspěšně odeslána!';
                    responseText.textContent = 'Děkuji za zprávu! Ozvu se vám co nejdříve.';
                    responseMessageContainer.className = 'response-message success';
                    responseMessageContainer.style.display = 'block';
                }, 500); // Ждем завершения анимации
                
            } else {
                 throw new Error(result.error || 'Něco se pokazilo. Zkuste to prosím znovu později.');
            }

        } catch (error) {
            // --- Обработка ошибки сети или сервера ---
            console.error('Form submission error:', error);
            
            // Показываем сообщение об ошибке прямо под формой
            // Вместо скрытия формы
            responseTitle.textContent = 'Chyba!';
            responseText.textContent = error.message;
            responseMessageContainer.className = 'response-message error';
            responseMessageContainer.style.display = 'block';
            
            // Прячем сообщение через 5 секунд
            setTimeout(() => {
                responseMessageContainer.style.display = 'none';
            }, 5000);

        } finally {
            // Восстанавливаем кнопку в любом случае
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Убираем ошибки при вводе
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
        field.addEventListener('input', () => {
             validateField(field); // Можно валидировать сразу
        });
    });
});