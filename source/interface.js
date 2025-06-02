// mobile & custom class sizing
function runDefualts() {
    document.getElementById('photography').textContent = window.innerWidth <= 775 ? '/photo' : '/photography';
    document.getElementById('downloadables').textContent = window.innerWidth <= 360 ? '↓' : 'downloadables';

    Array.from(document.querySelectorAll('.w-parent')).forEach(item => {
        item.style.width = window.getComputedStyle(item.parentElement).width;
    });
};

// why doesnt js allow for 2 fucking event in 1 listener jesus christ i fucking hate the web 😭
runDefualts();
addEventListener("resize", runDefualts);

// automated menus
function bindMenu(path, domain) {
    const trigger = document.getElementById(path);
    const bgcolor = window.getComputedStyle(trigger).getPropertyValue('background-color');
    const acolor = window.getComputedStyle(trigger).getPropertyValue('color');

    fetch(`https://${domain}/data.json`)
        .then(res => res.json())
        .then(data => {
            const rendered = Mustache.render(document.getElementById('menu-template').innerHTML, {
                id: `${path}-menu`,
                title: path,
                bgcolor,
                items: data.map(item => ({ ...item, color: acolor }))
            });

            // string to dom
            const temp = document.createElement('div');
            temp.innerHTML = rendered;
            const menu = temp.firstElementChild;

            // show/hide
            function open() {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', bgcolor);
                menu.classList.remove('-translate-y-full');
            }

            if (location.hash === `#${path}`) open();

            trigger.onclick = () => {
                if (location.hash != `#${path}`) {
                    history.pushState(null, '', `#${path}`);
                }
                open()
            };

            menu.querySelector('.close').onclick = () => {
                if (location.hash === `#${path}`) {
                    history.replaceState(null, '', location.pathname);
                }
                menu.classList.add('-translate-y-full');
                setTimeout(() => {
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
                }, 265);
            };

            document.body.appendChild(menu);
        })
        .catch(err => console.error(`error when loading ${path}:`, err));
}

bindMenu('downloadables', 'share.scot.wtf')
bindMenu('socials', 'socials.scot.wtf')