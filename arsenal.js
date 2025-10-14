document.addEventListener('DOMContentLoaded', () => {
    // This script only runs if it finds the filter menu on the page
    const filterMenu = document.querySelector('.filter-menu');
    if (!filterMenu) return;

    const filterButtons = filterMenu.querySelectorAll('.filter-btn');
    const mediaGrid = document.querySelector('.media-grid');
    const shillContainer = document.querySelector('.shill-posts-container');
    const mediaItems = mediaGrid.querySelectorAll('.media-item');

    // --- Sort Grid Items Alphabetically on Load ---
    const sortedItems = Array.from(mediaItems).sort((a, b) => {
        const titleA = a.querySelector('.media-title').textContent.trim().toLowerCase();
        const titleB = b.querySelector('.media-title').textContent.trim().toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
    sortedItems.forEach(item => mediaGrid.appendChild(item));
    
    // --- Setup Filter Buttons (with Counts) ---
    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        let count = 0;
        
        if (filter === 'all') {
            count = mediaItems.length;
        } else if (filter === 'shill') {
            count = shillContainer.querySelectorAll('.copy-btn').length;
        } else {
            count = document.querySelectorAll(`.media-item[data-category="${filter}"]`).length;
        }
        
        if (count > 0) {
            button.textContent += ` (${count})`;
        }

        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
    
            const clickedFilter = button.dataset.filter;
    
            if (clickedFilter === 'shill') {
                mediaGrid.style.display = 'none';
                shillContainer.style.display = 'block';
            } else {
                shillContainer.style.display = 'grid';
                shillContainer.style.display = 'none';
        
                sortedItems.forEach(item => {
                    if (clickedFilter === 'all' || item.dataset.category === clickedFilter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });

    // --- HELPER FUNCTIONS FOR THIS PAGE ---
    window.copyToClipboard = function(elementId) {
        const preElement = document.getElementById(elementId);
        if (!preElement) return;
        const textToCopy = preElement.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const button = preElement.nextElementSibling;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy.');
        });
    }
});
