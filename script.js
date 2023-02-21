const colors = document.querySelectorAll("input[type='color']")
const tapete = document.querySelector('.tapete')
const paddingSlider = document.querySelector("#range-padding")
const sizeSlider = document.querySelector("#range-size")
const borderSlider = document.querySelector("#range-borders")

function createBorders(num) {
    const createdBorders = new Array
    for (let i = 0; i < num*2; i++) {
        if (i < num){
            if (i % 2 == 0){
                createdBorders.push(`<div class="border out">`)
            } else {
                createdBorders.push(`<div class="border in">`)
            }
        } else {
            createdBorders.push(`</div>`)
        }
    }

    tapete.innerHTML = createdBorders.join('')
    borders = [...document.querySelectorAll(".border")]
}

borderSlider.addEventListener('change', () => {
    createBorders(borderSlider.value)
})

let borders = [...document.querySelectorAll(".border")]


colors.forEach(color => {
    color.addEventListener('input', () => {
        setColor(color.dataset.which, color.value)
    })
})

function setColor(which, color){
    const bordersToChange = borders.filter(border => border.classList.contains(which))
    bordersToChange.forEach(border => border.style.backgroundColor = color)
}

paddingSlider.addEventListener('change', () => {
    setPadding(paddingSlider.value)
})

sizeSlider.addEventListener('change', () => {
    setSize(sizeSlider.value)
})

function setPadding(padding){
    borders.forEach(border => border.style.padding = `${padding}px`)
}

function setSize(size){
    tapete.style.width = `${size}px`
}

