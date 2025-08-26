 document.addEventListener('DOMContentLoaded', () => {
    // ====== DATA SOURCE ======
    const POSTS = [
        { id:"blog-5", title:"Reasons to Have a Fast Website", dateISO:"2024-01-29", comments:0, img:"img/blog/blog-5.jpg", excerpt:"A fast-loading website provides a better user experience. Users are more likely to stay and engage...", href:"./blog/blog-5.html", alt:"Fast Website" },
        { id:"blog-4", title:"Testing Your Website To Know If it's Running Well", dateISO:"2024-01-29", comments:0, img:"img/blog/blog-4.jpg", excerpt:"If you want your website running well, here are some of the important tests you should consider...", href:"./blog/blog-4.html", alt:"Testing Website" },
        { id:"blog-3", title:"What Type of E-commerce Model Should I Choose For My Business", dateISO:"2024-01-26", comments:0, img:"img/blog/blog-3.jpg", excerpt:"There are several types of e-commerce models available. Here are some reasons why it is important...", href:"./blog/blog-3.html", alt:"E-commerce" },
        { id:"blog-2", title:"Why Having an App is So Important These Days", dateISO:"2024-01-25", comments:0, img:"img/blog/blog-2.jpg", excerpt:"Having a mobile app can bring several benefits to a company. Here are some reasons why it is crucial...", href:"./blog/blog-2.html", alt:"Mobile App" },
        { id:"blog-1", title:"Mobile Apps for Growth: Expand Your Reach", dateISO:"2024-01-25", comments:0, img:"img/blog/blog-1.jpg", excerpt:"From engagement to retention, mobile apps unlock new growth levers for modern businesses...", href:"./blog/blog-1.html", alt:"Mobile App Growth" }
        /*
        { 
        id:"blog-1", 
        title:"Mobile Apps for Growth: Expand Your Reach", 
        dateISO:"2024-01-25", 
        comments:0, 
        img:"img/blog/blog-1.jpg", 
        excerpt:"From engagement to retention, mobile apps unlock new growth levers for modern businesses...", 
        href:"blog00001.html", 
        alt:"Mobile App Growth" 
        }
        */
    ];

    const PAGE_SIZE = 5;
    const SIDEBAR_COUNT = 4;

    // ====== DOM ======
    const grid = document.getElementById('blogGrid');
    const sidebarList = document.getElementById('popularPosts');
    const loadBtn = document.getElementById('loadMore');
    const searchInput = document.getElementById('searchInput');

    // ====== utils ======
    const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    function formatMeta(dateISO, comments) {
        const d = new Date(dateISO);
        return `${d.getDate()} ${monthShort[d.getMonth()]} ${d.getFullYear()} - ${comments} comments`;
    }
    function el(html) {
        const t = document.createElement('template');
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    }
    function renderCard(post) {
        return el(`
        <a href="${post.href}" class="blog-card-link">
            <article class="blog-card">
            <img src="${post.img}" alt="${post.alt || post.title}">
            <div class="blog-content">
                <p class="blog-meta">${formatMeta(post.dateISO, post.comments)}</p>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
            </div>
            </article>
        </a>
        `);
    }

    function renderSidebarItem(post) {
    return el(`
        <a class="hotlink" href="${post.href}">
        <img class="hot-thumb" src="${post.img}" alt="${post.alt || post.title}">
        <div class="hot-body">
            <h4 class="hot-heading">${post.title}</h4>
            <div class="hot-meta">${formatMeta(post.dateISO, post.comments)}</div>
        </div>
        </a>
    `);
    }
    function shuffle(array) { // Fisher-Yates
        const a = array.slice();
        for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ====== state ======
    let visible = Math.min(PAGE_SIZE, POSTS.length);
    let isSearching = false;
    let searchResults = [];

    // ====== paint functions ======
    function paintGrid(list = POSTS) {
        grid.innerHTML = '';
        if (isSearching) {
        // show ALL matches when searching
        list.forEach(p => grid.appendChild(renderCard(p)));
        loadBtn.classList.add('is-hidden');
        return;
        }
        // normal paging mode
        for (let i = 0; i < Math.min(visible, list.length); i++) {
        grid.appendChild(renderCard(list[i]));
        }
        if (visible >= list.length) loadBtn.classList.add('is-hidden');
        else loadBtn.classList.remove('is-hidden');
    }

    function paintSidebarRandom() {
        sidebarList.innerHTML = '';
        const picks = shuffle(POSTS).slice(0, SIDEBAR_COUNT);
        picks.forEach(p => sidebarList.appendChild(renderSidebarItem(p)));
    }

    // ====== initial paint ======
    paintGrid();
    paintSidebarRandom();

    // ====== events ======
    loadBtn.addEventListener('click', () => {
        if (isSearching) return; // ignore in search mode
        visible = Math.min(visible + PAGE_SIZE, POSTS.length);
        paintGrid();
    });

    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) {
        // exit search → restore paging view
        isSearching = false;
        visible = Math.min(PAGE_SIZE, POSTS.length);
        paintGrid();
        paintSidebarRandom(); // refresh randoms if you like
        return;
        }
        // live search by title (contains)
        searchResults = POSTS.filter(p => p.title.toLowerCase().includes(q));
        isSearching = true;
        paintGrid(searchResults);
    });
    });