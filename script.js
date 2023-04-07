const colors = [...document.querySelectorAll("input[type='color']")]
const [outColor, inColor] = colors
const tapete = document.querySelector('.tapete')
const sizeSlider = document.querySelector("#range-size")
const borderSlider = document.querySelector("#range-borders")
const colorSwap = document.querySelector('.color-swap')
const randomColor = document.querySelector('.random-color')
const randomBttns = [...document.querySelectorAll('.random-bttn')]
const [randomLeft, randomRight] = randomBttns
let tapeteSet = Array.from({length: 10})
let tapeteIndex
let borders
setBorders()
addTapetes('#a52a2a', '#790018')
showArrows()
verifyStorage()

borderSlider.addEventListener('input', () => { createBorders(borderSlider.value) })

// Cria uma array contendo todas as bordas
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
    setBorders()
}

colors.forEach(color => {
    color.addEventListener('input', () => { 
        setColor(color.dataset.which, color.value)
    })
})

// Muda a cor da borda de acordo com o input de cor
function setColor(which, color){
    document.documentElement.style.setProperty(`--${which}-color`, color)
    document.documentElement.style.setProperty(`--${which}-highlight`, `${hexToHSL(color)}`)
    tapeteSet[tapeteIndex][which] = color
}

sizeSlider.addEventListener('input', () => { 
    setSize(sizeSlider.value) 
})
// Muda a varíavel de tamanho do tapete 
function setSize(size){
    document.documentElement.style.setProperty(`--tapete-width`, `${size}px`)
}

colorSwap.addEventListener('click', swapColor)
function swapColor() {
    // Inverte a cor 'in' com a 'out'
    const inColorV = inColor.value
    const outColorV = outColor.value

    tapeteSet[tapeteIndex]['out'] = inColorV
    tapeteSet[tapeteIndex]['in'] = outColorV

    updateColors(outColorV, inColorV)
    saveTapete()
}

randomColor.addEventListener('click', randomizeColors)
function randomizeColors() {
    const randomHex = () => {
        let n = Math.floor((0xffffff*Math.random())).toString(16).padStart(6, '0')
        return '#' + n.slice(0, 6)
    }

    // Gera duas cores aleatórias para 'in' e 'out'
    const firstColor = randomHex()
    const secondColor = randomHex()

    addTapetes(firstColor, secondColor)
    updateColors(firstColor, secondColor)
    saveTapete()
}

// Muda o tapete que está sendo mostrado
function updateColors(firstColor, secondColor) {
    document.documentElement.style.setProperty(`--in-color`, firstColor)
    document.documentElement.style.setProperty(`--out-color`, secondColor)
    inColor.value = firstColor
    outColor.value = secondColor

    document.documentElement.style.setProperty(`--in-highlight`, `${hexToHSL(firstColor)}`)
    document.documentElement.style.setProperty(`--out-highlight`, `${hexToHSL(secondColor)}`)

    showArrows()
}

// Se for o primeiro tapete, a seta esquerda fica bloqueada
// Se for o último tapete, a seta direita fica bloqueada
function showArrows() {
    let firstIndex = 0
    while (!tapeteSet[firstIndex]) {
        firstIndex++
    }

    isFirst = tapeteIndex === firstIndex
    isLast = tapeteIndex === tapeteSet.length - 1

    if (isFirst) {
        randomLeft.classList.add('block')
    } else {
        randomLeft.classList.remove('block')
    }
    
    if (isLast) {
        randomRight.classList.add('block')
    } else {
        randomRight.classList.remove('block')
    }

}

// Adiciona um tapete novo aos tapetes e atualiza o index para ser o último
function addTapetes(firstColor, secondColor) {
    const tapeteObj = {in: firstColor, out: secondColor}
    tapeteSet.push(tapeteObj)
    tapeteSet.shift()

    tapeteIndex = tapeteSet.length - 1
}

// Salva localmente os tapetes
function saveTapete() {
    const toSave = {
        tapeteSet,
        tapeteIndex
    }
    localStorage.setItem('tapete-set', JSON.stringify(toSave))
}

// Se já houver salvo no localStorage, muda a variável dos tapetes para a salva localmente
function verifyStorage() {
    const tapeteStorage = JSON.parse(localStorage.getItem('tapete-set'))
    if (!tapeteStorage) return

    tapeteSet = Array.from(tapeteStorage['tapeteSet'])
    tapeteIndex = tapeteStorage['tapeteIndex']
    updateColors(tapeteSet[tapeteIndex]['in'], tapeteSet[tapeteIndex]['out'])
}

window.addEventListener('mousemove', e => {
    console.log(e.target.classList.contains('border'))
})

// Atualiza a varíavel das bordas
function setBorders() {
    borders = document.querySelectorAll('.border')
    borders.forEach(border => {
        // border.addEventListener('mouseenter', handleBorderEnter)
        // border.addEventListener('mouseout', handleBorderLeave)
        border.addEventListener('click', handleBorderClick, { capture: false })
    })
}

// Quando o mouse entra na borda, deixa ela 'marcada'
function handleBorderEnter(e) {
    console.log('Entrou')
    borders.forEach(border => border.classList.remove('highlight'))

    e.target.classList.add('highlight')
    e.stopPropagation()
}

// Quando o mouse saí da borda, deixa ela 'desmarcada'
function handleBorderLeave(e) {
    console.log('Saiu')
    borders.forEach(border => border.classList.remove('highlight'))
    
    const parent = e.target.parentElement
    if (!parent.classList.contains('tapete')) parent.classList.add('highlight')
    e.stopPropagation()
}

// Ao clicar na borda, abre o input de cor respectivo
function handleBorderClick(e) {
    const classy = [...e.target.classList].find(c => c === 'out' || c === 'in')
    if (classy === 'in') { 
        inColor.click()
    } else if (classy === 'out') { 
        outColor.click()
    }
    borders.forEach(border => border.classList.remove('highlight'))
    e.stopPropagation()
}

randomBttns.forEach(randomBttn => {
    randomBttn.addEventListener('click', handleRandomClick)
})

// Troca o tapete atual de acordo com o botão
function handleRandomClick(e) {
    const walk = Number(e.target.dataset.walk)
    if (tapeteIndex + walk < 0 || tapeteIndex + walk >= tapeteSet.length) return
    if (!tapeteSet[tapeteIndex + walk]) return
    tapeteIndex += walk

    updateColors(tapeteSet[tapeteIndex]['in'], tapeteSet[tapeteIndex]['out'])
    saveTapete()
}

// Transforma Hex em HSL
function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    // l = +(l * 100).toFixed(1);
    l = 80
  
    return "hsl(" + h + "," + s + "%," + l + "%)";
}