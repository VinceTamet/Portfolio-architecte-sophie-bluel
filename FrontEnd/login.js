function logIn() {
    const loginForm = document.getElementById('login-form')
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault()
    
        // Charge utile
        const loginObject = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        }
        console.log(email)
        console.log(password)
        const chargeUtile = JSON.stringify(loginObject)
    
        // TODO
        //const forgottenPassword = document.getElementById('forgotten-password')
        try {
            // on gère la réponse
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: chargeUtile
            })
            if (response.ok) {
                const dataLogIn = await response.json()
                localStorage.setItem("authToken", dataLogIn.token)
                window.location.href = 'index.html'
            } else {
                throw new Error('Ya une erreur dans le mail ou le mdp bg')
            }
        } catch (error) {           
            
        }
        
    })
    }
    
    logIn()