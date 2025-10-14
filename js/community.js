document.addEventListener('DOMContentLoaded', () => {
    if (typeof members === 'undefined' || members.length === 0) {
        console.error('Hall of Fame member data is not loaded.');
        return;
    }

    const cardContainer = document.querySelector('.trading-card-container');
    const selectorContainer = document.querySelector('.hof-selector-container');
    const leftArrow = document.querySelector('.hof-arrow.left');
    const rightArrow = document.querySelector('.hof-arrow.right');
    let currentIndex = 0;

    function renderCard(index) {
        const member = members[index];
        if (!cardContainer) return;
        
        cardContainer.innerHTML = `
            <div class="trading-card">
                <div class="card-header">
                    <span class="card-name">${member.name}</span>
                </div>
                <a href="${member.xLink}" target="_blank" rel="noopener noreferrer" class="card-pfp-container">
                    <img src="${member.img}" alt="${member.name}'s profile picture" loading="lazy">
                </a>
                <div class="card-info">
                    <h4>Badges of Honor</h4>
                    <div class="card-badges">
                        ${member.badges.map(badge => `<div class="badge badge-${badge.type}" title="${getBadgeTitle(badge)}"></div>`).join('')}
                    </div>
                </div>
            </div>
        `;

        // Update active bubble
        document.querySelectorAll('.hof-bubble').forEach((bubble, i) => {
            bubble.classList.toggle('active', i === index);
        });
    }

    function getBadgeTitle(badge) {
        // This is a simplified placeholder. You can expand this with full descriptions.
        return `${badge.tier} ${badge.type}`;
    }

    function populateSelector() {
        if (!selectorContainer) return;
        selectorContainer.innerHTML = members.map((member, index) => `
            <div class="hof-bubble" data-index="${index}">
                <img src="${member.img}" alt="${member.name}">
            </div>
        `).join('');

        document.querySelectorAll('.hof-bubble').forEach(bubble => {
            bubble.addEventListener('click', (e) => {
                currentIndex = parseInt(e.currentTarget.dataset.index);
                renderCard(currentIndex);
            });
        });
    }
    
    // Arrow functionality
    if (leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + members.length) % members.length;
            renderCard(currentIndex);
        });
        rightArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % members.length;
            renderCard(currentIndex);
        });
    }

    // Initial Load
    populateSelector();
    renderCard(currentIndex);
});
