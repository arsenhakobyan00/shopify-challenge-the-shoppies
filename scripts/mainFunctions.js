let nominatedMovies = []

const searchMovie = () => {
    const searchItem = $$('#search_item')
    let inputVal = $$('#movie_search').value.trim()
    searchItem.innerHTML = inputVal

    if (inputVal.length === 1) {
        show($$('#search-length-warning'))
    }
    else if (inputVal.length === 0 && nominatedMovies.length === 0) {
        hide($$('.results'))
        hide($$('.nominations'))
    }
    else {
        hide($$('#search-length-warning'))
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=13e10828&type=movie&s=${inputVal}`)
            .then(resp => resp.json())
            .then(data => {
                const movieList = $$('.movie-list')
                const moviesFound = $$('#movies_found')

                movieList.innerHTML = ''
                moviesFound.innerHTML = '0'

                let resultJSON = data['Search']

                const ul = document.createElement('ul')

                resultJSON.forEach(item => {
                    let li = document.createElement('li')
                    li.innerHTML = `${item['Title']} (${item['Year']}) <br><img class='poster' src='${item['Poster']}' alt='Poster'><br><button class='nominate-btn'>Nominate</button>`
                    li.children[3].addEventListener('click', nominateMovie)
                    ul.appendChild(li);
                })

                moviesFound.innerHTML = resultJSON.length
                movieList.appendChild(ul)

                show($$('.results'))
                show($$('.nominations'))
            })
            .catch(err => console.warn('Somewthing went wrong', err))
    }
}

const nominateMovie = (e) => {
    // Check nominated movies limit
    if (nominatedMovies.length < 5) {
        // Change the button to say 'Remove' rather than 'Nominate'
        let nominatedMovie = changeBtn(e)

        let listToRemove = getListItem(e);

        // check if already in the list
        let alreadyNominated = nominatedMovies.some((movie) => {
            return movie.isEqualNode(listToRemove);
        })

        if (!alreadyNominated) {
            // Bring the nominated movie to the nominations section
            nominatedMovies.push(nominatedMovie)
            displayNominatedMovies()
        } else {
            alert('Movie already nominated...')
        }
    } else {
        alert('Only allowed to nominate up to 5 movies...')
    }
}

const changeBtn = el => {
    let li = getListItem(el)
    let liBtn = li.children[3]
    liBtn.textContent = 'Remove'
    liBtn.removeEventListener('click', nominateMovie)
    liBtn.addEventListener('click', removeNominatedMovie)
    return li
}

const getListItem = el => el.path[1]

const removeNominatedMovie = (e) => {

    let movieItem = getListItem(e)

    if (nominatedMovies.includes(movieItem)) {
        nominatedMovies = nominatedMovies.filter(item => item !== movieItem)
        displayNominatedMovies()
    }

}

const displayNominatedMovies = () => {
    // Clear list if enabled
    if ($$('.nominations-list')) $$('.nominations-list').innerHTML = '';

    // Increase the nominated movies count
    $$('#nominations_limit').textContent = nominatedMovies.length

    let ul = document.createElement('ul')
    nominatedMovies.forEach(movie => ul.appendChild(movie))
    $$('.nominations-list').appendChild(ul)
} 
