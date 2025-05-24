// mobile 
function truncate() {
    if (window.innerWidth <= 775) {
        document.getElementById('photography').textContent = '/photo';
    hasDvd = true;
    } else if (window.innerWidth >= 775) {
        document.getElementById('photography').textContent = '/photography';
    }
};

// why doesnt js allow for 2 fucking event in 1 listener jesus christ i fucking hate the web 😭
addEventListener("resize", truncate);
addEventListener("load", truncate);

/* menu code 

    CONCEPT: CMS THIS OR SOMETHING SO THAT COLORS FOLLOW BUTTON CLICKED COLORS AND AUTOMATE
*/
const downloads_menu = document.getElementById('download-menu');

document.getElementById('downloadables').onclick = (() => {
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#dee9fc');
    downloads_menu.classList.remove('-translate-y-full');
});

document.getElementById('d-close').onclick = (() => {
    downloads_menu.classList.add('-translate-y-full');
    setTimeout(() => {
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
    }, 250);
});

const socials_menu = document.getElementById('social-menu');

document.getElementById('socials').onclick = (() => {
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#effccf');
    socials_menu.classList.remove('-translate-y-full');
});

document.getElementById('s-close').onclick = (() => {
    socials_menu.classList.add('-translate-y-full');
    setTimeout(() => {
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
    }, 250);
});