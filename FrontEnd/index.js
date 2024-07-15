// On récupère les données de l'API
console.log(localStorage.getItem("authToken"))

// On récupère les categories
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories")
  const categories = await response.json()
  return categories
}

// On récupère les projets
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works")
  const works = await response.json()
  return works
}

function createCategoryMenu(categories) {
  const menuContainer = document.querySelector("#category-menu")
  const noFilterButton = document.createElement("button")
  noFilterButton.textContent = "Tous"
  noFilterButton.addEventListener("click", () => {
    displayAllWorks()
    setActiveButton(noFilterButton)
  })
  menuContainer.appendChild(noFilterButton)

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    if (category) {
      const button = document.createElement("button")
      button.textContent = category.name
      button.dataset.categoryId = category.id
      button.addEventListener("click", () => {
        filterWorksByCategory(category.id)
        setActiveButton(button)
      })
      menuContainer.appendChild(button)
    }
  }
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll("#category-menu button")
  buttons.forEach(button => {
    button.classList.remove("active")
  })
  activeButton.classList.add("active")
}

function filterWorksByCategory(categoryId) {
  getWorks()
    .then((works) => {
      const filteredWorks = works.filter(
        (work) => work.categoryId === categoryId
      )
      displayWorks(filteredWorks)
    })
    .catch((error) => {
      console.log(error)
    })
}

// On affiche les données récupérées et on les ajoute dynamiquement
function displayWorks(works) {
  const gallery = document.querySelector(".gallery")
  // on vide la gallerie
  gallery.innerHTML = ""

  // on crée les éléments pour chaque projet récupéré
  for (let i = 0; i < works.length; i++) {
    const projet = works[i]
    if (projet) {
      const figure = document.createElement("figure")
      const img = document.createElement("img")
      img.src = projet.imageUrl
      img.title = projet.title
      const figcaption = document.createElement("figcaption")
      figcaption.textContent = projet.title

      // on intègre les éléments
      figure.appendChild(img)
      figure.appendChild(figcaption)
      gallery.appendChild(figure)
    }
  }
}

function displayAllWorks() {
  getWorks().then((works) => {
    displayWorks(works)
  })
}

const categories = await getCategories()
createCategoryMenu(categories)
const works = await getWorks()
displayWorks(works)


// Si la connextion est effectuée, on affiche le bouton "Modifier"
function displayEditPage () {
  const authToken = localStorage.getItem("authToken")
  const modifierBtn = document.getElementById("modifier-btn")
  const adminBanner = document.getElementById("admin-banner")
    if (authToken) {
        modifierBtn.style.display = "inline-block"
        adminBanner.style.display = "flex"
    }
  }
  displayEditPage()

async function deleteWork(id) {
  const authToken = localStorage.getItem("authToken");
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  })
}

// MODALE
const editBtn = document.getElementById("modifier-btn")
const closeBtns = document.querySelectorAll(".close")

  // Ouvrir la modale de suppresion
  editBtn.addEventListener("click", () => {
    const editModal = document.getElementById("edit-modal")
    editModal.style.display = "block"
    loadModalWorks()
  })

  // Fermer la modale
  closeBtns.forEach(span => {
    span.addEventListener("click", () => {
      const modal = span.closest(".modal")
      modal.style.display = "none"
    })
  })
  
  // Fermer la modale en cliquant en dehors de la modale
  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal")
    modals.forEach(modal => {
      if (event.target == modal) {
        modal.style.display = "none"
      }
    })
  })

  // On ouvre la modale pour ajouter une photo
  const addPhotoBtn = document.getElementById("add-photo")
  addPhotoBtn.addEventListener("click", () => {
    const editModal = document.getElementById("edit-modal")
    const addPhotoModal = document.getElementById("add-photo-modal")
    editModal.style.display = "none"
    addPhotoModal.style.display = "block"
    loadCategories()
  })

  // On va chercher les catégories pour la liste déroulante
  async function loadCategories() {
    const categories = await getCategories()
    const categorySelect = document.getElementById("category-select")
    categorySelect.innerHTML = ""
  
    for (let i = 0; i < categories.length; i++) {
      const option = document.createElement("option")
      option.value = categories[i].id
      option.textContent = categories[i].name
      categorySelect.appendChild(option)
    }
  }

   // On envoie le formulaire pour ajouter une photo
  const addPhotoForm = document.getElementById("add-photo-form")
  addPhotoForm.addEventListener("submit", function (event) {
    event.preventDefault()

    const photoInput = document.getElementById("image")
    const titleInput = document.getElementById("title")
    const categorySelect = document.getElementById("category-select")
    const responseMessage = document.getElementById("success-message")

    const formData = new FormData()
    formData.append("image", photoInput.files[0])
    formData.append("title", titleInput.value)
    formData.append("category", categorySelect.value)
    
    const authToken = localStorage.getItem("authToken")

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }).then(response => response.json()).then(data => {
      console.log(data);
      responseMessage.innerHTML = "La photo a été ajoutée avec succès. GG !"
        responseMessage.style.color = "green"
    }).catch(error => console.error('Soucis lors de l\'ajout du projet :', error))

    document.getElementById("add-photo-modal").style.display = "none"
    displayAllWorks()
    loadModalWorks()
  })

  
  async function loadModalWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    const galleryModal = document.querySelector(".gallery-modal")
    galleryModal.innerHTML = ""

    for (let i = 0; i < works.length; i++) {
      const work = works[i]
      const figure = document.createElement("figure")
      const img = document.createElement("img")
      img.src = work.imageUrl
      img.alt = work.title
      // const figcaption = document.createElement("figcaption")
      // figcaption.textContent = work.title
  
      const deleteBtn = document.createElement("button")
      deleteBtn.classList.add("delete-btn")
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
      deleteBtn.addEventListener("click", async () => {
        await deleteWork(work.id)
        loadModalWorks()
      })
  
      figure.appendChild(img)
      // figure.appendChild(figcaption)
      figure.appendChild(deleteBtn)
      galleryModal.appendChild(figure)
    }
  }

  
