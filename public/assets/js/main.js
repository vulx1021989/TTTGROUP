document.addEventListener("DOMContentLoaded", function() {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    
    // Nếu đang ở trong pages/services/ -> lùi 2 cấp để ra gốc project ('../../')
    // Nếu đang ở trong pages/ (index, news, careers, contact) -> lùi 1 cấp ('../')
    let pathToRoot = "../";
    if (pathSegments.includes('services')) {
        pathToRoot = "../";
    }

    // 1. Nạp Header
    fetch(pathToRoot + 'assets/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('site-header').innerHTML = data;
            
            // Xử lý lại đường dẫn liên kết menu (trỏ trực tiếp vào thư mục pages/)
            const links = document.querySelectorAll('#site-header [data-link]');
            links.forEach(link => {
                const target = link.getAttribute('data-link');
                link.setAttribute('href', pathToRoot + 'pages/' + target);
            });

            highlightActiveMenu();
        });

    // 2. Nạp Footer
    fetch(pathToRoot + 'assets/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('site-footer').innerHTML = data;
            
            const links = document.querySelectorAll('#site-footer [data-link]');
            links.forEach(link => {
                const target = link.getAttribute('data-link');
                link.setAttribute('href', pathToRoot + 'pages/' + target);
            });
        });
});

function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href) && href !== "#") {
            item.classList.add('active');
        }
    });
}