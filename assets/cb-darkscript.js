const cookbook = JSON.parse(localStorage.getItem('cookbook') || '[]');

function displayLocalStorage() {
    const localStorageContentDiv = document.getElementById('localStorage');
    localStorageContentDiv.innerHTML = ''; 
    for (let i = 0; i < cookbook.length; i++) {
        // const key = localStorage.key(i);
        // const value = JSON.parse(localStorage.getItem(key));
        // const keyValueParagraph = document.createElement('p');
        // keyValueParagraph.textContent = `${key}: ${JSON.stringify(value)}`;
        // localStorageContentDiv.appendChild(keyValueParagraph);
        const img = document.createElement('img');
        img.src = cookbook[i].Recipe;
        img.classList.add('img-responses');
        const h3 = document.createElement('h3');
        h3.textContent = `Category: ${cookbook[i].Category}`;
        const p = document.createElement('p');
        p.textContent = `Instructions: ${cookbook[i].Instructions}`;
        const div = document.createElement('div');
        div.classList.add('food')
        div.append(img, h3, p);
        localStorageContentDiv.append(div)
    }
}

window.onload = function() {
    displayLocalStorage();
};