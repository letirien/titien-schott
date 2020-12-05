// On créé un observeur qui va détecter quand l'élément sera visible
const observer = new IntersectionObserver(
    entries => {
        // Fonction qui sera lancé quand un des éléments du tableau devient visible
        entries.forEach(entry => {
            console.log(entry.target.tagName)
            // Si un ou plusieurs éléments sont visible (à + de 50% - 0.5)
            if (entry.intersectionRatio > 0.5) {
                if (entry.target.tagName == 'H1') {
                    entry.target.classList.add('underline')

                } else {
                    // On récupère les cercles de compétences pour leur appliquer l'animation
                    const circles = entry.target.querySelectorAll('.cercle')
                    const circlesload = entry.target.querySelectorAll('.load')
                    // On fait une boucle for i pour appliquer un délai de plus en plus grand
                    // Qui ajoute la class .appear (keyframes)
                    for (let i = 0; i < circles.length; i++) {
                        const cercle = circles[i]
                        setTimeout(() => {
                            cercle.classList.add('appear')
                        }, i * 200)
                    }
                    for (let i = 0; i < circlesload.length; i++) {
                        const cercleload = circlesload[i]
                        setTimeout(() => {
                            cercleload.classList.add('loop')
                        }, i * 400)
                    }
                    
                }
                // On arrête d'observer l'élément pour des raisons de performance
                observer.unobserve(entry.target)
            }

        })
    }, {
        threshold: 0.7 // 70% de l'élément visible
    }
)

// On observe chaque container (dès qu'il sera visible il lancera la fonction plus haut)
document.querySelectorAll('.aligncercle')
    .forEach(element => observer.observe(element))

document.querySelectorAll('h1')
    .forEach(titre => observer.observe(titre))

var navitems = [...document.querySelectorAll('.navbar .navlist__item')].reverse()

for (let i = 0; i < navitems.length; i++) {
    const item = navitems[i]
    setTimeout(() => {
        item.classList.add('anim')
    }, i * 250)
}