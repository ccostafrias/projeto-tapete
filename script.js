const colors = document.querySelectorAll("input[type='color']")
const [inColor, outColor] = colors
const tapete = document.querySelector('.tapete')
const sizeSlider = document.querySelector("#range-size")
const borderSlider = document.querySelector("#range-borders")
const colorSwap = document.querySelector('.color-swap')
const randomColor = document.querySelector('.random-color')

borderSlider.addEventListener('change', () => { createBorders(borderSlider.value) })
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
    document.documentElement.style.setProperty(`--num-borders`, `${num}`)
}

colors.forEach(color => {
    color.addEventListener('input', () => { setColor(color.dataset.which, color.value) })
})

function setColor(which, color){
    document.documentElement.style.setProperty(`--${which}-color`, `${color}`)
}

sizeSlider.addEventListener('change', () => { setSize(sizeSlider.value) })
function setSize(size){
    document.documentElement.style.setProperty(`--tapete-width`, `${size}px`)
}

colorSwap.addEventListener('click', swapColor)
function swapColor() {
    const inColorV = inColor.value
    const outColorV = outColor.value

    updateColors(outColorV, inColorV)
}

randomColor.addEventListener('click', randomizeColors)
function randomizeColors() {
    const randomHex = () => {
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
    }

    updateColors(randomHex(), randomHex())
}

function updateColors(firstColor, secondColor) {
    document.documentElement.style.setProperty(`--in-color`, `${firstColor}`)
    document.documentElement.style.setProperty(`--out-color`, `${secondColor}`)
    inColor.value = firstColor
    outColor.value = secondColor
}
