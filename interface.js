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
                bgcolor: bgcolor,
                items: data.map(item => ({ ...item, color: acolor }))
            });

            // string to dom
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = rendered;
            const menu = tempContainer.firstElementChild;

            // show/hide
            function open() {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', bgcolor);
                menu.classList.remove('-translate-y-full');
            }

            if (window.location.hash == `#${path}`) {
                open()
            }

            trigger.onclick = () => {
                if (window.location.hash != `#${path}`) {
                    window.location.hash = path;
                }
                open()
            };

            menu.querySelector('.close').onclick = () => {
                if (window.location.hash === `#${path}`) {
                    history.replaceState(null, '', window.location.pathname);
                }
                menu.classList.add('-translate-y-full');
                setTimeout(() => {
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
                }, 265);
            };

            document.body.appendChild(menu);
        })
        .catch(err => console.error('error when loading menu:', err));
}

bindMenu('downloadables', 'share.scot.wtf')
bindMenu('socials', 'socials.scot.wtf')