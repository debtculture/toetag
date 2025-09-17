window.ethereum = undefined;

// --- DOMContentLoaded Event Listener ---
// Main entry point for the script after the initial HTML is loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive components
    initializeEventListeners();
    initializeMatrix();
    startMatrixRain();
    setPhantomLink();
    updateCommunityCarousel();
    initializeRoadmapPhases();
    initializeAudioPlayer();
    
    // Trigger a scroll event on load to make sure visible sections animate in
    window.dispatchEvent(new Event('scroll'));

    // Attempt to restore a previous wallet session
    restoreWalletSession();
});

// --- Initialization Functions ---

/**
 * Attaches all primary event listeners to static elements on the page.
 */
function initializeEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    const mobileWalletBtn = document.getElementById('connectWalletMobile');
    if (mobileWalletBtn) {
        mobileWalletBtn.addEventListener('click', handleMobileWalletClick);
    }
    
    const desktopWalletBtn = document.getElementById('connectWalletDesktop');
    if (desktopWalletBtn) {
        desktopWalletBtn.addEventListener('click', handleDesktopWalletClick);
    }
    
    const closeWalletModalBtn = document.querySelector('#walletModal button[onclick="closeWalletModal()"]');
    if (closeWalletModalBtn) {
        closeWalletModalBtn.addEventListener('click', closeWalletModal);
    }

    const disconnectBtn = document.querySelector('#walletInfo button[onclick="disconnectWallet()"]');
    if(disconnectBtn) {
        disconnectBtn.addEventListener('click', disconnectWallet);
    }

    const hideInfoBtn = document.querySelector('#walletInfo button[onclick="hideWalletInfo()"]');
    if(hideInfoBtn) {
        hideInfoBtn.addEventListener('click', hideWalletInfo);
    }

    // Scroll listener for animations
    window.addEventListener('scroll', handleScrollAnimations);
}

/**
 * Sets up and starts the red "Matrix" background effect.
 */
function initializeMatrix() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let columns;
    let drops = [];
    const fontSize = 14;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.ceil(canvas.width / fontSize);
        drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * canvas.height));
    }
    
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
    
    function draw() {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff5555';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(draw, 50);
}

/**
 * Sets up and starts the grey "Matrix Rain" overlay effect.
 */
function startMatrixRain() {
    const rainCanvas = document.getElementById('matrix-rain');
    if (!rainCanvas) return;
    const rainCtx = rainCanvas.getContext('2d');
    
    let columns;
    let drops = [];
    const fontSize = 14;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function resizeRainCanvas() {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
        columns = Math.ceil(rainCanvas.width / fontSize);
        drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * rainCanvas.height));
    }
    
    window.addEventListener('resize', resizeRainCanvas, false);
    resizeRainCanvas();

    function drawRain() {
        rainCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
        rainCtx.fillStyle = '#999999';
        rainCtx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            rainCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > rainCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawRain, 50);
}


/**
 * Sets the correct download link for the Phantom wallet based on the user's device.
 */
function setPhantomLink() {
    const phantomLink = document.getElementById('phantomLink');
    if (!phantomLink) return;
    try {
        const userAgent = navigator.userAgent;
        const isAndroid = /Android/i.test(userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        if (isAndroid) {
            phantomLink.href = 'https://play.google.com/store/apps/details?id=app.phantom';
        } else if (isIOS) {
            phantomLink.href = 'https://apps.apple.com/app/phantom-crypto-wallet/id1598432977';
        } else {
            phantomLink.href = 'https://phantom.app/download';
        }
    } catch (error) {
        console.error('Error setting Phantom link:', error);
        phantomLink.href = 'https://phantom.app/'; // Fallback
    }
}

/**
 * Initializes the blurred state and click-to-reveal functionality for future roadmap phases.
 */
function initializeRoadmapPhases() {
    document.querySelectorAll('.future-phase').forEach(phase => {
        phase.addEventListener('click', () => {
            phase.classList.toggle('active');
        });
    });
}

// --- UI Interaction Functions ---

/**
 * Toggles the visibility of the mobile navigation menu.
 */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (!menu || !hamburger) return;

    const isOpen = menu.style.display === 'block';
    menu.style.display = isOpen ? 'none' : 'block';
    hamburger.classList.toggle('active', !isOpen);
    menu.setAttribute('aria-expanded', String(!isOpen));
}

/**
 * Closes the mobile menu.
 */
function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu) {
        menu.style.display = 'none';
        menu.setAttribute('aria-expanded', 'false');
    }
    if (hamburger) {
        hamburger.classList.remove('active');
    }
}

/**
 * Toggles the visibility of the resources dropdown in the mobile menu.
 */
function toggleDropdown() {
    const dropdown = document.getElementById('mobileDropdown');
    if (!dropdown) return;
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
}

/**
 * Smoothly scrolls to a specific section on the page.
 * @param {string} selector - The CSS selector of the element to scroll to.
 */
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const headerOffset = 70; // Offset for the fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + elementPosition - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        closeMenu(); // Close mobile menu on navigation
    }
}

/**
 * Handles the accordion functionality for the FAQ section.
 * @param {HTMLElement} header - The clicked accordion header element.
 */
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const allContents = document.querySelectorAll('.accordion-content');

    // Close all other accordions
    allContents.forEach(item => {
        if (item !== content) {
            item.classList.remove('active');
            item.style.maxHeight = null;
            item.previousElementSibling.classList.remove('active');
            item.previousElementSibling.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle the clicked accordion
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        content.style.maxHeight = null;
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
    } else {
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Copies the contract address to the clipboard and shows a confirmation message.
 * @param {HTMLElement} element - The clickable element containing the address.
 */
function copyAddress(element) {
    const addressText = element.querySelector('.address-text')?.textContent.trim();
    if (!addressText) return;

    navigator.clipboard.writeText(addressText).then(() => {
        element.setAttribute('data-copied', 'true');
        setTimeout(() => {
            element.setAttribute('data-copied', 'false');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy address: ', err);
        // Provide a fallback for users
        alert(`Could not copy automatically. Please copy manually: ${addressText}`);
    });
}

/**
 * Toggles the visibility of the floating social media bubbles on mobile.
 */
function toggleSocialBubbles() {
    const bubbles = document.querySelector('.social-bubbles');
    const button = document.querySelector('.join-rebellion');
    if (bubbles && button) {
        const isActive = bubbles.classList.toggle('active');
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-expanded', String(isActive));
    }
}


// --- Animation Handling ---

/**
 * Adds 'visible' class to elements as they scroll into view.
 */
function handleScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.section, .section-connector, .phase, .future-teaser, .buy-step');
    const windowHeight = window.innerHeight;

    elementsToAnimate.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        // Trigger animation when the top of the element is 85% up the screen
        if (elementTop < windowHeight * 0.85) {
            el.classList.add('visible');
        }
    });
}

// --- Wallet Integration ---

// Wallet constants
const DEBT_MINT_ADDRESS = '9NQc7BnhfLbNwVFXrVsymEdqEFRuv5e1k7CuQW82pump';
const HELIUS_API_KEY = 'c57c8d55-3e55-4160-9d8c-00df2c3fb22e';
const WALLETS = [
    { name: 'Phantom', id: 'phantom', icon: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1749488428/Phantom_Wallet_s3cahc.jpg', deepLink: 'phantom://', downloadUrl: 'https://phantom.app/download' },
    { name: 'Solflare', id: 'solflare', icon: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1749488428/Solflare_Wallet_nxcl95.jpg', deepLink: 'solflare://', downloadUrl: 'https://solflare.com/download' },
    { name: 'Backpack', id: 'backpack', icon: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1750446379/backpack_rer24o.jpg', deepLink: 'backpack://', downloadUrl: 'https://backpack.app/download' }
];

// Wallet UI Handlers
function handleMobileWalletClick() {
    const mobileButton = document.getElementById('connectWalletMobile');
    if (mobileButton.classList.contains('connected')) {
        toggleWalletInfo();
    } else {
        openWalletModal();
    }
}

function handleDesktopWalletClick() {
    const desktopBubble = document.getElementById('connectWalletDesktop');
    if (desktopBubble.classList.contains('connected')) {
        toggleWalletInfo();
    } else {
        openWalletModal();
    }
}

function toggleWalletInfo() {
    const walletInfo = document.getElementById('walletInfo');
    walletInfo.style.display = walletInfo.style.display === 'block' ? 'none' : 'block';
}

function hideWalletInfo() {
    document.getElementById('walletInfo').style.display = 'none';
}

function openWalletModal() {
    const walletModal = document.getElementById('walletModal');
    const walletList = document.getElementById('walletList');
    walletList.innerHTML = ''; // Clear previous options

    WALLETS.forEach(wallet => {
        const button = document.createElement('button');
        button.className = 'wallet-option';
        button.style.cssText = 'display: flex; align-items: center; justify-content: center; padding: 10px; width: 100%; background: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s;';
        button.innerHTML = `<img src="${wallet.icon}" alt="${wallet.name}" width="30" height="30" style="margin-right: 10px;"> ${wallet.name}`;
        
        button.addEventListener('mouseover', () => button.style.background = '#ff5555');
        button.addEventListener('mouseout', () => button.style.background = '#333');
        button.addEventListener('click', () => connectWallet(wallet.id));
        
        walletList.appendChild(button);
    });

    walletModal.style.display = 'flex';
}

function closeWalletModal() {
    document.getElementById('walletModal').style.display = 'none';
}

/**
 * Attempts to connect to the user's selected Solana wallet.
 * @param {string} walletId - The ID of the wallet to connect to ('phantom', 'solflare', etc.).
 */
async function connectWallet(walletId) {
    closeWalletModal();
    const wallet = WALLETS.find(w => w.id === walletId);
    if (!wallet) return;

    try {
        const provider = getWalletProvider(walletId);
        if (!provider) {
            if (confirm(`You don't have ${wallet.name} installed. Would you like to install it now?`)) {
                window.open(wallet.downloadUrl, '_blank');
            }
            return;
        }

        await provider.connect();
        const publicKey = provider.publicKey.toString();
        
        localStorage.setItem('walletAddress', publicKey);
        localStorage.setItem('walletType', walletId);
        
        updateUIWithWalletData(publicKey);
        setupWalletListeners(provider);

    } catch (error) {
        console.error(`Error connecting to ${wallet.name}:`, error);
        alert(`Failed to connect to ${wallet.name}. Please ensure your wallet is unlocked and try again.`);
    }
}

/**
 * Disconnects the currently connected wallet.
 */
async function disconnectWallet() {
    const walletType = localStorage.getItem('walletType');
    try {
        const provider = getWalletProvider(walletType);
        if (provider && provider.disconnect) {
            await provider.disconnect();
        }
    } catch (error) {
        console.error('Error during disconnect:', error);
    } finally {
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletType');
        updateUIToDisconnectedState();
    }
}

/**
 * Restores a wallet session from localStorage if available.
 */
async function restoreWalletSession() {
    const walletType = localStorage.getItem('walletType');
    const walletAddress = localStorage.getItem('walletAddress');
    
    if (walletType && walletAddress) {
        try {
            const provider = getWalletProvider(walletType);
            if (provider) {
                // Use onlyIfTrusted to prevent popup on page load
                await provider.connect({ onlyIfTrusted: true });
                if (provider.publicKey && provider.publicKey.toString() === walletAddress) {
                    updateUIWithWalletData(walletAddress);
                    setupWalletListeners(provider);
                } else {
                    // Stored address doesn't match, so clear storage
                    disconnectWallet();
                }
            }
        } catch (error) {
            console.log('Could not restore wallet session silently.', error);
            // Clear storage if silent connect fails
            disconnectWallet();
        }
    }
}

// --- Wallet Helper Functions ---

/**
 * Gets the wallet provider object from the window.
 * @param {string} walletId - The ID of the wallet.
 * @returns {object|null} The provider object or null.
 */
function getWalletProvider(walletId) {
    if (walletId === 'phantom' && window.solana?.isPhantom) return window.solana;
    if (walletId === 'solflare' && window.solflare?.isSolflare) return window.solflare;
    if (walletId === 'backpack' && window.backpack) return window.backpack;
    return null;
}

/**
 * Fetches the user's $DEBT balance.
 * @param {string} publicKey - The user's public key.
 * @returns {Promise<string>} The formatted balance string.
 */
async function getDebtBalance(publicKey) {
    const url = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=${HELIUS_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Helius API error: ${response.statusText}`);
        const data = await response.json();
        const debtToken = data.tokens.find(t => t.mint === DEBT_MINT_ADDRESS);
        
        if (debtToken && debtToken.amount) {
            const balance = debtToken.amount / (10 ** debtToken.decimals);
            return `${balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} $DEBT`;
        }
        return '0.00 $DEBT';
    } catch (error) {
        console.error('Failed to fetch $DEBT balance:', error);
        return 'Error fetching balance';
    }
}

/**
 * Sets up event listeners for wallet events like account changes.
 * @param {object} provider - The wallet provider object.
 */
function setupWalletListeners(provider) {
    // Using .off/.removeListener before .on/.addListener to prevent duplicates
    if (typeof provider.removeListener === 'function') {
        provider.removeListener('accountChanged', handleAccountChange);
    }
    if (typeof provider.on === 'function') {
        provider.on('accountChanged', handleAccountChange);
    }
}

function handleAccountChange(publicKey) {
    if (publicKey) {
        const newAddress = publicKey.toString();
        localStorage.setItem('walletAddress', newAddress);
        updateUIWithWalletData(newAddress);
    } else {
        disconnectWallet();
    }
}


// --- Wallet UI Update Functions ---

/**
 * Updates the UI elements to show the connected wallet state.
 * @param {string} publicKey - The user's public key.
 */
async function updateUIWithWalletData(publicKey) {
    const shortAddress = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
    
    // Update buttons
    const mobileButton = document.getElementById('connectWalletMobile');
    const desktopBubbleSpan = document.querySelector('#connectWalletDesktop span');
    if (mobileButton) {
        mobileButton.textContent = shortAddress;
        mobileButton.classList.add('connected');
    }
    if (desktopBubbleSpan) {
        desktopBubbleSpan.textContent = shortAddress;
        desktopBubbleSpan.parentElement.parentElement.classList.add('connected');
    }

    // Update info panel
    document.querySelector('#walletAddress span').textContent = shortAddress;
    document.querySelector('#debtBalance span').textContent = 'Loading...';
    
    // Fetch and display balance
    const balance = await getDebtBalance(publicKey);
    document.querySelector('#debtBalance span').textContent = balance;
}

/**
 * Updates the UI to reflect a disconnected wallet state.
 */
function updateUIToDisconnectedState() {
    // Update buttons
    const mobileButton = document.getElementById('connectWalletMobile');
    const desktopBubbleSpan = document.querySelector('#connectWalletDesktop span');
    if (mobileButton) {
        mobileButton.textContent = 'Select Wallet';
        mobileButton.classList.remove('connected');
    }
    if (desktopBubbleSpan) {
        desktopBubbleSpan.textContent = 'Select Wallet';
        desktopBubbleSpan.parentElement.parentElement.classList.remove('connected');
    }
    
    // Hide info panel
    document.getElementById('walletInfo').style.display = 'none';
}


// --- Community/HOF Carousel ---
let currentCommunityIndex = 0;
let communityAutoRotateInterval;
const HOF_MEMBERS_DATA = [
    { name: 'Autopsy', title: 'The Visionary', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755034972/Autopsy_zocebq.jpg', desc: 'Placeholder description for Autopsy.', xLink: 'https://x.com/AutopsyT2', badges: [{ name: 'Supernova', tier: 'amethyst', type: 'spaces' }, { name: 'Inferno', tier: 'gold', type: 'burn' }, { name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    { name: 'Catavina', title: 'The Cheerleader', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1746723030/catavina_dfcvoe.jpg', desc: 'Placeholder description for Catavina.', xLink: 'https://x.com/catavina17', badges: [{ name: 'Supernova', tier: 'amethyst', type: 'spaces' }, { name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    { name: 'Lou', title: 'The Rally', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752948926/Lou2_kxasor.jpg', desc: 'Placeholder description for Lou.', xLink: 'https://x.com/louisedbegin', badges: [{ name: 'Supernova', tier: 'amethyst', type: 'spaces' }, { name: 'Iron Grip', tier: 'silver', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }] },
    { name: 'Tormund', title: 'The Oracle', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1746723031/Tormund_pj4hwd.jpg', desc: 'Placeholder description for Tormund.', xLink: 'https://x.com/Tormund_17', badges: [{ name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    { name: 'JPEG', title: 'The Youngblood', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755034794/JPEG_rte1vj.jpg', desc: 'Placeholder description for JPEG.', xLink: 'https://x.com/jpegfein', badges: [{ name: 'Star Commander', tier: 'gold', type: 'spaces' }, { name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    { name: 'blu', title: 'The Warden', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1746723030/blu_fko02p.jpg', desc: 'Placeholder description for blu.', xLink: 'https://x.com/blu_chek', badges: [{ name: 'Iron Grip', tier: 'silver', type: 'holding' }, { name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }] },
    { name: 'Drinks', title: 'The Party', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1748906211/Drinks_tibhzd.jpg', desc: 'Placeholder description for Drinks.', xLink: 'https://x.com/drinkonsaturday', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Renee', title: 'The Support', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747850503/Renee_eekhuh.jpg', desc: 'Placeholder description for Renee.', xLink: 'https://x.com/ReneeBush96829', badges: [{ name: 'Iron Grip', tier: 'silver', type: 'holding' }, { name: 'Orbiter', tier: 'bronze', type: 'spaces' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }] },
    { name: 'Ambient', title: 'The Voice', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1748906930/Ambient_jztyfi.jpg', desc: 'Placeholder description for Ambient.', xLink: 'https://x.com/AmbientSound', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Tom', title: 'The King', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752948926/Tom2_jguhcy.jpg', desc: 'Placeholder description for Tom.', xLink: 'https://x.com/tholson90', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Lunicking', title: 'The Spark', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1746723031/Lunic_k1ndzn.jpg', desc: 'Placeholder description for Lunicking.', xLink: 'https://x.com/Lunicking178677', badges: [{ name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Orbiter', tier: 'bronze', type: 'spaces' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    { name: 'Cory B', title: 'The Bengal', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747354104/Cory_qntp8y.jpg', desc: 'Placeholder description for Cory B.', xLink: 'https://x.com/coryb410', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Dan', title: 'The Vibes', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747354104/Dan_uu4sey.jpg', desc: 'Placeholder description for Dan.', xLink: 'https://x.com/DanVibes10', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'DK', title: 'The Maverick', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1748911711/DK_umvnpw.jpg', desc: 'Placeholder description for DK.', xLink: 'https://x.com/PgHYinzer86', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Xelly', title: 'The Wizard', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032224/Xelly_emjfwc.jpg', desc: 'Placeholder description for Xelly.', xLink: 'https://x.com/d_xelly', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Rankin', title: 'The Survivalist', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752608381/rankin_rtxpjb.jpg', desc: 'Placeholder description for Rankin.', xLink: 'https://x.com/rankin56696', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Scrappy', title: 'The Goofball', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752948926/scrappy2_ihsso6.jpg', desc: 'Placeholder description for Scrappy.', xLink: 'https://x.com/bigsoup6_7', badges: [{ name: 'Iron Grip', tier: 'silver', type: 'holding' }, { name: 'Cosmonaut', tier: 'silver', type: 'spaces' }] },
    { name: 'Mia', title: 'The Mystery', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1754610304/KNg3MAIS_400x400_tmabka.jpg', desc: 'Placeholder description for Mia.', xLink: 'https://x.com/GirlMia9079', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Elvis', title: 'The Toker', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752608182/Elvis_yrnpxh.png', desc: 'Placeholder description for Elvis.', xLink: 'https://x.com/ElpatronSFC', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Bstr', title: 'The Creative', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752608094/bstr_knv2eq.jpg', desc: 'Placeholder description for Bstr.', xLink: 'https://x.com/Bstr___', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'George', title: 'The Wise', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747417142/George_q1e0c2.jpg', desc: 'Placeholder description for George.', xLink: 'https://x.com/GeorgeCdr28874', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Dog', title: 'The Loyal', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752948926/Dog2_sb9l5v.jpg', desc: 'Placeholder description for Dog.', xLink: 'https://x.com/Dog66515910', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }] },
    { name: 'Marilyn', title: 'The Rockstar', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752948926/Marilyn2_gzdbq2.jpg', desc: 'Placeholder description for Marilyn.', xLink: 'https://x.com/Marilyn_Moanroe', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }] },
    { name: 'ZOMBi', title: 'The Artist', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747354104/ZOMBi_obepxi.jpg', desc: 'Placeholder description for ZOMBi.', xLink: 'https://x.com/HauskenHelge', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Cyanide', title: 'The Poison', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747416884/Cyanide_w72xvh.jpg', desc: 'Placeholder description for Cyanide.', xLink: 'https://x.com/ipoopcrypto', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Demitrieus', title: 'The Unicorn', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752608298/Demitrieus_yfwnic.jpg', desc: 'Placeholder description for Demitrieus.', xLink: 'https://x.com/RecklesUnicorn', badges: [{ name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Mo', title: 'The Degen', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747419309/MoDegen_gl6zjo.jpg', desc: 'Placeholder description for Mo.', xLink: 'https://x.com/MoDegen1369', badges: [{ name: 'Steel Reserve', tier: 'gold', type: 'holding' }] },
    { name: 'Coinbud', title: 'The Expert', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1747354104/Coinbud_uwjumu.jpg', desc: 'Placeholder description for Coinbud.', xLink: 'https://x.com/madgamer1979', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Momma Blu', title: 'The Protector', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755031232/Momma_Blu_l3c8z8.jpg', desc: 'Placeholder description for Momma Blu.', xLink: 'https://x.com/AngelaPatt86456', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] }, 
    { name: 'Thurston', title: 'The Catspert', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032869/Thurston_n6zd2i.jpg', desc: 'Placeholder description for Thurston.', xLink: 'https://x.com/ThurstonWaffles', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Michael', title: 'The Promoter', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1752608011/michael_prp7ml.jpg', desc: 'Placeholder description for Michael.', xLink: 'https://x.com/Mich_ipromotion', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Gnomie', title: 'The Homie', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032415/Gnomie_puf31y.jpg', desc: 'Placeholder description for Gnomie.', xLink: 'https://x.com/medraresteaker', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'AJ', title: 'The DJ', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032499/AJ_s3hfjk.png', desc: 'Placeholder description for AJ.', xLink: 'https://x.com/blaze_mb21', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'George Eager', title: 'The Believer', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032568/George_Eager_ckxq9y.jpg', desc: 'Placeholder description for George Eager.', xLink: 'https://x.com/edition1', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Denzel', title: 'The Chill', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032699/Denzel_bmt4td.jpg', desc: 'Placeholder description for Denzel.', xLink: 'https://x.com/0xDnxl', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] },
    { name: 'Tree', title: 'The Roots', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032771/Tree_bggo4f.jpg', desc: 'Placeholder description for Tree.', xLink: 'https://x.com/TheresaWeik', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] }
];


function updateCommunityCarousel() {
    const member = HOF_MEMBERS_DATA[currentCommunityIndex];
    const featuredCard = document.querySelector('#hof-featured .trading-card');
    if (!featuredCard) return;

    featuredCard.setAttribute('data-x-link', member.xLink);
    featuredCard.querySelector('.pfp-link').href = member.xLink;
    const pfpImg = featuredCard.querySelector('.card-pfp-square img');
    pfpImg.src = member.img;
    pfpImg.alt = `${member.name} profile picture`;
    featuredCard.querySelector('.hof-name').textContent = member.name;

    const badgesContainer = featuredCard.querySelector('#hof-badges');
    badgesContainer.innerHTML = ''; // Clear existing badges
    
    // Your badge rendering logic here...
}

function rotateHof(direction) {
    if (direction === 'right') {
        currentCommunityIndex = (currentCommunityIndex + 1) % HOF_MEMBERS_DATA.length;
    } else {
        currentCommunityIndex = (currentCommunityIndex - 1 + HOF_MEMBERS_DATA.length) % HOF_MEMBERS_DATA.length;
    }
    updateCommunityCarousel();
    resetCommunityAutoRotate();
}

function autoRotateCommunity() {
    currentCommunityIndex = (currentCommunityIndex + 1) % HOF_MEMBERS_DATA.length;
    updateCommunityCarousel();
}

function resetCommunityAutoRotate() {
    clearInterval(communityAutoRotateInterval);
    communityAutoRotateInterval = setInterval(autoRotateCommunity, 10000);
}

// Add listeners for carousel interaction
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.hof-carousel');
    if (carousel) {
        carousel.addEventListener('mousedown', () => clearInterval(communityAutoRotateInterval));
        carousel.addEventListener('mouseup', resetCommunityAutoRotate);
        carousel.addEventListener('touchstart', () => clearInterval(communityAutoRotateInterval));
        carousel.addEventListener('touchend', resetCommunityAutoRotate);
    }
    const leftArrow = document.querySelector('.hof-left-arrow');
    const rightArrow = document.querySelector('.hof-right-arrow');
    if(leftArrow) leftArrow.addEventListener('click', () => rotateHof('left'));
    if(rightArrow) rightArrow.addEventListener('click', () => rotateHof('right'));
});


// --- Audio Player ---
const PLAYLIST = [
    { title: "D.E.B.T.", artist: "Ambient Sounds", src: "https://res.cloudinary.com/dpvptjn4t/video/upload/v1755035512/Don_t_Ever_Believe_Them_NEW_i3h7wa.mov" },
    { title: "Tough Souls", artist: "Ambient Sounds", src: "https://res.cloudinary.com/dpvptjn4t/video/upload/v1751153796/D.E.B.T._nkijpl.wav" },
    { title: "Burn", artist: "Ambient Sounds", src: "https://res.cloudinary.com/dpvptjn4t/video/upload/v1751151703/Burn_c7qcmi.wav" },
    { title: "Freedom Fighters", artist: "Ambient Sounds", src: "https://res.cloudinary.com/dpvptjn4t/video/upload/v1751151703/Freedom_Fighters_somsv2.wav" },
    { title: "Get Out", artist: "Ambient Sounds", src: "https://res.cloudinary.com/dpvptjn4t/video/upload/v1751151703/Get_Out_oor74k.wav" },
    { title: "KABOOM!", artist: "Ambient Sounds", src: "https://res.cloudinary.com/dpvptjn4t/video/upload/v1751151702/KABOOM_pac3lb.wav" }
];
let currentTrackIndex = 0;

function initializeAudioPlayer() {
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause');
    const prevTrackBtn = document.getElementById('prev-track');
    const nextTrackBtn = document.getElementById('next-track');
    const playPauseBtnMobile = document.getElementById('play-pause-mobile');
    const prevTrackBtnMobile = document.getElementById('prev-track-mobile');
    const nextTrackBtnMobile = document.getElementById('next-track-mobile');
    const audioPlayer = document.getElementById('audio-player');
    const audioPlayerMobile = document.getElementById('audioPlayerMobile');
    const singlePlayButton = document.getElementById('single-play-button');
    const logoBtn = document.getElementById('logo-btn');
    const trackInfoSpan = document.querySelector('#track-info span');
    const trackInfoMobileSpan = document.querySelector('#track-info-mobile span');

    function loadTrack(index) {
        const track = PLAYLIST[index];
        audio.src = track.src;
        trackInfoSpan.textContent = `${track.title} - ${track.artist}`;
        trackInfoMobileSpan.textContent = `${track.title} - ${track.artist}`;
        audio.load();
        audio.play().catch(e => console.log("Autoplay was prevented.", e));
    }

    function togglePlayPause() {
        if (audio.paused) {
            audio.play().catch(e => console.log("Play action was prevented.", e));
        } else {
            audio.pause();
        }
    }
    
    function updatePlayPauseIcons() {
        const isPaused = audio.paused;
        playPauseBtn.className = isPaused ? 'audio-btn play' : 'audio-btn pause';
        playPauseBtnMobile.className = isPaused ? 'audio-btn play' : 'audio-btn pause';
        audioPlayerMobile.classList.toggle('playing', !isPaused);
        trackInfoSpan.style.animationPlayState = isPaused ? 'paused' : 'running';
        trackInfoMobileSpan.style.animationPlayState = isPaused ? 'paused' : 'running';
    }

    logoBtn.addEventListener('click', () => {
        const isActive = audioPlayer.classList.toggle('active');
        logoBtn.classList.toggle('active', isActive);
        if (isActive && !audio.src) {
            loadTrack(currentTrackIndex);
        }
    });

    singlePlayButton.addEventListener('click', () => {
        singlePlayButton.style.display = 'none';
        audioPlayerMobile.style.display = 'flex'; // Use flex to match CSS
        audioPlayerMobile.classList.add('active');
        if (!audio.src) {
            loadTrack(currentTrackIndex);
        } else {
            togglePlayPause();
        }
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    playPauseBtnMobile.addEventListener('click', togglePlayPause);
    
    const playNextTrack = () => {
        currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
        loadTrack(currentTrackIndex);
    };

    const playPrevTrack = () => {
        currentTrackIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        loadTrack(currentTrackIndex);
    };

    nextTrackBtn.addEventListener('click', playNextTrack);
    nextTrackBtnMobile.addEventListener('click', playNextTrack);
    prevTrackBtn.addEventListener('click', playPrevTrack);
    prevTrackBtnMobile.addEventListener('click', playPrevTrack);

    audio.addEventListener('play', updatePlayPauseIcons);
    audio.addEventListener('pause', updatePlayPauseIcons);
    audio.addEventListener('ended', playNextTrack);
    audio.addEventListener('error', () => {
        console.error("Audio playback error. Skipping to next track.");
        playNextTrack();
    });
}
