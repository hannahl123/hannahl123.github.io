//hamburger
const navSlide = () => {
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".nav-bar");
    const navLinks = document.querySelectorAll(".nav-bar li");
    hamburger.onclick = () => {
        navbar.classList.toggle("nav-active");
        //hamburger animation
        hamburger.classList.toggle("toggle");
    }
}

window.onload = () => {
    const textElement = document.querySelector('.fade-in-text');
    const text = textElement.innerText;
    textElement.innerHTML = '';

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');

        if (char === ' ') {
            span.innerHTML = '&nbsp;';
            span.style.display = 'inline-block';
            span.style.animation = 'none';
        } else {
            span.innerText = char;
            span.style.animationDelay = `${index * 0.1}s`;
        }

        textElement.appendChild(span);
    });
};
