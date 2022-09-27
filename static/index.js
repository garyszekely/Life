$(function() {
    $('#login-form').on('submit', async () => {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: $('#login-email-input').val(),
                password: $('#login-password-input').val()
            })
        })
        if (res.ok) {

        } else {

        }
    });

    $('#sign-up-form').on('submit', async () => {
        const res = await fetch('/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: $('#sign-up-email-input').val(),
                password: $('#sign-up-password-input').val()
            })
        })
        if (res.ok) {

        } else {

        }
    });
})