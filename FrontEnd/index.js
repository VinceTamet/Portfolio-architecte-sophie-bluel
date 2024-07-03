    // On récupère les données de l'API
    console.log(localStorage.getItem("authToken"))
    // On récupère les categories
    async function getCategories() {
      const response = await fetch('http://localhost:5678/api/categories')
      const categories = await response.json()
      console.log(categories)
      return categories
    }

    // On récupère les projets
    async function getWorks() {
        const response = await fetch('http://localhost:5678/api/works')
        const works = await response.json()
        return works
    }

    function createCategoryMenu(categories) {
        const menuContainer = document.querySelector('#category-menu')
        const noFilterButton = document.createElement('button')
        noFilterButton.textContent = "Tous"
        noFilterButton.addEventListener('click', () => {
            displayAllWorks()
        })
        menuContainer.appendChild(noFilterButton)

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            if (category) {
                const button = document.createElement('button')
                button.textContent = category.name
                button.dataset.categoryId = category.id

                button.addEventListener('click', () => {
                    filterWorksByCategory(category.id)
                })
                menuContainer.appendChild(button)
            }
        }    
    }

    function filterWorksByCategory(categoryId) {
        getWorks().then(works => {
            const filteredWorks = works.filter(work => work.categoryId === categoryId)
            displayWorks(filteredWorks)
        }).catch(error => {
            console.log(error)
        })
    }

    // On affiche les données récupérées et on les ajoute dynamiquement
    function displayWorks(works) {
        const gallery = document.querySelector('.gallery')
        // on vide la gallerie
        gallery.innerHTML = ''

        // on crée les éléments pour chaque projet récupéré 
        for (let i = 0; i < works.length; i++) {
            const projet = works[i]
            if (projet) {
                const figure = document.createElement('figure')
                const img = document.createElement('img')
                img.src = projet.imageUrl
                img.title = projet.title
                const figcaption = document.createElement('figcaption')
                figcaption.textContent = projet.title

                // on intègre les éléments
                figure.appendChild(img)
                figure.appendChild(figcaption)
                gallery.appendChild(figure)
            }
        }
    }

    function displayAllWorks() {
        getWorks().then(works => {
            displayWorks(works)
        })
    }

    const categories = await getCategories()
    createCategoryMenu(categories)
    const works = await getWorks()
    displayWorks(works)


