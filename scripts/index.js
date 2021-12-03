const $$ = (el) => document.querySelector(el)

const show = (el) => {
    el.style.display = 'block'
}

const hide = (el) => {
    el.style.display = 'none'
}

const toggle = (el) => {
    if (window.getComputedStyle(el).display === 'block') {
        hide(el)
        return
    }
    show(el)
}

hide($$('.results'))
hide($$('.nominations'))

$$('#movie_search').addEventListener('keyup', searchMovie)