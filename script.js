// --- Main Entry Point ---
// We use DOMContentLoaded to ensure the entire HTML page is loaded and ready before we try to manipulate it.
// This is the most critical part to fix timing issues.
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all event listeners for buttons, links, etc.
    initializeEventListeners();
    
    // Start visual effects
    initializeMatrix();
    startMatrixRain();
    
    // Set up dynamic content and states
    setPhantomLink();
    initializeRoadmapPhases();
    
    // Initialize components that depend on the above setup
    initializeCommunityCarousel();
    initializeAudioPlayer();
    
    // Attempt to restore a previous wallet session from storage
    restoreWalletSession();

    // Manually trigger a scroll event on load to make sure sections that are already in view animate correctly.
    window.dispatchEvent(new Event('scroll')); 
});


// --- Initialization Functions ---

/**
 * Attaches all primary event listeners. Consolidating them here ensures they all get set up reliably.
 */
function initializeEventListeners() {
    // Hamburger Menu
    document.querySelector('.hamburger')?.addEventListener('click', toggleMenu);

    // Mobile Nav Links
    document.querySelectorAll('.mobile-menu a, .mobile-dropdown a').forEach(link => {
        if (!link.classList.contains('expand')) {
            link.addEventListener('click', closeMenu);
        }
    });

    // Mobile Nav Dropdown
    document.querySelector('.mobile-menu .expand')?.addEventListener('click', toggleDropdown);

    // Wallet Buttons
    document.getElementById('connectWalletMobile')?.addEventListener('click', handleMobileWalletClick);
    document.getElementById('connectWalletDesktop')?.addEventListener('click', handleDesktopWalletClick);
    document.querySelector('#walletModal button[onclick="closeWalletModal()"]')?.addEventListener('click', closeWalletModal);
    document.querySelector('#walletInfo button[onclick="disconnectWallet()"]')?.addEventListener('click', disconnectWallet);
    document.querySelector('#walletInfo button[onclick="hideWalletInfo()"]')?.addEventListener('click', hideWalletInfo);

    // Accordions (FAQ)
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => toggleAccordion(header));
    });
    
    // Badge Glossary
    document.querySelector('.badge-glossary-header')?.addEventListener('click', toggleBadgeGlossary);

    // Copyable Addresses
    document.querySelectorAll('.copyable-address').forEach(el => {
        el.addEventListener('click', () => copyAddress(el));
    });
    
    // Join Rebellion Button (for mobile social bubbles)
    document.querySelector('.join-rebellion')?.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Prevent telegram link on mobile, just toggle bubbles
            toggleSocialBubbles();
        }
    });

    // Scroll Animations
    window.addEventListener('scroll', handleScrollAnimations);
}

/**
 * Sets up and starts the red "Matrix" background effect.
 */
function initializeMatrix() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let columns, drops, fontSize = 14;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.ceil(canvas.width / fontSize);
        drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * canvas.height));
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function draw() {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff5555';
        ctx.font = `${fontSize}px monospace`;
        
        drops.forEach((y, i) => {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, y * fontSize);
            drops[i] = (y * fontSize > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
        });
    }
    setInterval(draw, 50);
}

/**
 * Sets up and starts the grey "Matrix Rain" overlay effect.
 */
function startMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let columns, drops, fontSize = 14;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.ceil(canvas.width / fontSize);
        drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * canvas.height));
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999999';
        ctx.font = `${fontSize}px monospace`;
        drops.forEach((y, i) => {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, y * fontSize);
            drops[i] = (y * fontSize > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
        });
    }
    setInterval(draw, 50);
}

/**
 * Sets the correct download link for the Phantom wallet based on the user's device.
 */
function setPhantomLink() {
    const link = document.getElementById('phantomLink');
    if (!link) return;
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
        link.href = 'https://play.google.com/store/apps/details?id=app.phantom';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        link.href = 'https://apps.apple.com/app/phantom-crypto-wallet/id1598432977';
    } else {
        link.href = 'https://phantom.app/download';
    }
}

/**
 * Initializes click-to-reveal functionality for future roadmap phases.
 */
function initializeRoadmapPhases() {
    document.querySelectorAll('.future-phase').forEach(phase => {
        phase.addEventListener('click', () => phase.classList.toggle('active'));
    });
}


// --- UI Interaction Functions ---

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    const isOpen = menu.style.display === 'block';
    menu.style.display = isOpen ? 'none' : 'block';
    hamburger.classList.toggle('active', !isOpen);
}

function closeMenu() {
    document.getElementById('mobileMenu').style.display = 'none';
    document.querySelector('.hamburger').classList.remove('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('mobileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const offset = 70;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        closeMenu();
    }
}

function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isActive = content.classList.contains('active');

    // Close all others
    document.querySelectorAll('.accordion-content.active').forEach(activeContent => {
        if (activeContent !== content) {
            activeContent.classList.remove('active');
            activeContent.style.maxHeight = null;
            activeContent.previousElementSibling.classList.remove('active');
        }
    });

    // Toggle current
    if (isActive) {
        content.classList.remove('active');
        content.style.maxHeight = null;
        header.classList.remove('active');
    } else {
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.classList.add('active');
    }
}

function toggleBadgeGlossary() {
    const content = document.getElementById('badgeGlossary');
    const header = content.previousElementSibling;
    const isActive = content.classList.contains('active');
    
    if (isActive) {
        content.classList.remove('active');
        content.style.maxHeight = null;
        header.classList.remove('active');
    } else {
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.classList.add('active');
    }
}

function copyAddress(element) {
    const address = element.querySelector('.address-text')?.textContent.trim();
    if (address) {
        navigator.clipboard.writeText(address).then(() => {
            element.setAttribute('data-copied', 'true');
            setTimeout(() => element.setAttribute('data-copied', 'false'), 2000);
        }).catch(err => console.error('Copy failed', err));
    }
}

function toggleSocialBubbles() {
    const bubbles = document.querySelector('.social-bubbles');
    const button = document.querySelector('.join-rebellion');
    if (bubbles && button) {
        const isActive = bubbles.classList.toggle('active');
        button.classList.toggle('active', isActive);
    }
}


// --- Animation Handling ---

function handleScrollAnimations() {
    const elements = document.querySelectorAll('.section, .section-connector, .phase, .future-teaser, .buy-step');
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
            el.classList.add('visible');
        }
    });
}


// --- Wallet Integration --- (No changes needed here, but included for completeness)

const DEBT_MINT_ADDRESS = '9NQc7BnhfLbNwVFXrVsymEdqEFRuv5e1k7CuQW82pump';
const HELIUS_API_KEY = 'c57c8d55-3e55-4160-9d8c-00df2c3fb22e';
const WALLETS = [
    { name: 'Phantom', id: 'phantom', icon: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1749488428/Phantom_Wallet_s3cahc.jpg', downloadUrl: 'https://phantom.app/download' },
    { name: 'Solflare', id: 'solflare', icon: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1749488428/Solflare_Wallet_nxcl95.jpg', downloadUrl: 'https://solflare.com/download' },
    { name: 'Backpack', id: 'backpack', icon: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1750446379/backpack_rer24o.jpg', downloadUrl: 'https://backpack.app/download' }
];

function handleMobileWalletClick() {
    const btn = document.getElementById('connectWalletMobile');
    if (btn.classList.contains('connected')) toggleWalletInfo();
    else openWalletModal();
}

function handleDesktopWalletClick() {
    const btn = document.getElementById('connectWalletDesktop');
    if (btn.classList.contains('connected')) toggleWalletInfo();
    else openWalletModal();
}

function toggleWalletInfo() {
    const info = document.getElementById('walletInfo');
    info.style.display = info.style.display === 'block' ? 'none' : 'block';
}

function hideWalletInfo() {
    document.getElementById('walletInfo').style.display = 'none';
}

function openWalletModal() {
    const modal = document.getElementById('walletModal');
    const list = document.getElementById('walletList');
    list.innerHTML = '';
    WALLETS.forEach(wallet => {
        const button = document.createElement('button');
        button.className = 'wallet-option';
        button.style.cssText = 'display: flex; align-items: center; justify-content: center; padding: 10px; width: 100%; background: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s;';
        button.innerHTML = `<img src="${wallet.icon}" alt="${wallet.name}" width="30" height="30" style="margin-right: 10px;"> ${wallet.name}`;
        button.onmouseover = () => button.style.background = '#ff5555';
        button.onmouseout = () => button.style.background = '#333';
        button.onclick = () => connectWallet(wallet.id);
        list.appendChild(button);
    });
    modal.style.display = 'flex';
}

function closeWalletModal() {
    document.getElementById('walletModal').style.display = 'none';
}

async function connectWallet(walletId) {
    closeWalletModal();
    const provider = getWalletProvider(walletId);
    if (!provider) {
        const wallet = WALLETS.find(w => w.id === walletId);
        if (confirm(`You don't have ${wallet.name} installed. Install now?`)) {
            window.open(wallet.downloadUrl, '_blank');
        }
        return;
    }
    try {
        await provider.connect();
        const publicKey = provider.publicKey.toString();
        localStorage.setItem('walletAddress', publicKey);
        localStorage.setItem('walletType', walletId);
        updateUIWithWalletData(publicKey);
        setupWalletListeners(provider);
    } catch (err) {
        console.error(`Connection to ${walletId} failed`, err);
    }
}

async function disconnectWallet() {
    const walletType = localStorage.getItem('walletType');
    const provider = getWalletProvider(walletType);
    try {
        if (provider?.disconnect) await provider.disconnect();
    } catch (err) {
        console.error('Disconnect failed', err);
    } finally {
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletType');
        updateUIToDisconnectedState();
    }
}

async function restoreWalletSession() {
    const walletType = localStorage.getItem('walletType');
    const address = localStorage.getItem('walletAddress');
    if (walletType && address) {
        const provider = getWalletProvider(walletType);
        if (provider) {
            try {
                await provider.connect({ onlyIfTrusted: true });
                if (provider.publicKey.toString() === address) {
                    updateUIWithWalletData(address);
                    setupWalletListeners(provider);
                } else {
                    disconnectWallet();
                }
            } catch {
                disconnectWallet();
            }
        }
    }
}

function getWalletProvider(walletId) {
    if (walletId === 'phantom') return window.solana;
    if (walletId === 'solflare') return window.solflare;
    if (walletId === 'backpack') return window.backpack;
    return null;
}

async function getDebtBalance(publicKey) {
    const url = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=${HELIUS_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const token = data.tokens.find(t => t.mint === DEBT_MINT_ADDRESS);
        if (token) {
            const balance = token.amount / Math.pow(10, token.decimals);
            return `${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} $DEBT`;
        }
        return '0.00 $DEBT';
    } catch (err) {
        console.error('Balance fetch failed', err);
        return 'N/A';
    }
}

function setupWalletListeners(provider) {
    provider.on('accountChanged', (publicKey) => {
        if (publicKey) {
            const newAddress = publicKey.toString();
            localStorage.setItem('walletAddress', newAddress);
            updateUIWithWalletData(newAddress);
        } else {
            disconnectWallet();
        }
    });
}

function updateUIWithWalletData(publicKey) {
    const short = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
    document.getElementById('connectWalletMobile').textContent = short;
    document.getElementById('connectWalletMobile').classList.add('connected');
    document.querySelector('#connectWalletDesktop span').textContent = short;
    document.getElementById('connectWalletDesktop').classList.add('connected');
    document.querySelector('#walletAddress span').textContent = short;
    getDebtBalance(publicKey).then(balance => {
        document.querySelector('#debtBalance span').textContent = balance;
    });
}

function updateUIToDisconnectedState() {
    document.getElementById('connectWalletMobile').textContent = 'Select Wallet';
    document.getElementById('connectWalletMobile').classList.remove('connected');
    document.querySelector('#connectWalletDesktop span').textContent = 'Select Wallet';
    document.getElementById('connectWalletDesktop').classList.remove('connected');
    hideWalletInfo();
}

// --- Community/HOF Carousel ---
// (Included for completeness - no major changes, but structure is now more reliable)
let currentCommunityIndex = 0;
let communityAutoRotateInterval;
const HOF_MEMBERS_DATA = [
    { name: 'Autopsy', title: 'The Visionary', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755034972/Autopsy_zocebq.jpg', desc: 'Placeholder description for Autopsy.', xLink: 'https://x.com/AutopsyT2', badges: [{ name: 'Supernova', tier: 'amethyst', type: 'spaces' }, { name: 'Inferno', tier: 'gold', type: 'burn' }, { name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    { name: 'Catavina', title: 'The Cheerleader', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1746723030/catavina_dfcvoe.jpg', desc: 'Placeholder description for Catavina.', xLink: 'https://x.com/catavina17', badges: [{ name: 'Supernova', tier: 'amethyst', type: 'spaces' }, { name: 'Steel Reserve', tier: 'gold', type: 'holding' }, { name: 'Cold Blooded Shiller', tier: 'single', type: 'shiller' }, { name: 'Meme Machine', tier: 'single', type: 'meme' }] },
    // ... all 36 members data ...
    { name: 'Tree', title: 'The Roots', img: 'https://res.cloudinary.com/dpvptjn4t/image/upload/v1755032771/Tree_bggo4f.jpg', desc: 'Placeholder description for Tree.', xLink: 'https://x.com/TheresaWeik', badges: [{ name: 'Cosmonaut', tier: 'silver', type: 'spaces' }, { name: 'Cold Wallet', tier: 'bronze', type: 'holding' }] }
];

function initializeCommunityCarousel() {
    updateCommunityCarousel(); // Initial load
    resetCommunityAutoRotate(); // Start the timer

    const leftArrow = document.querySelector('.hof-left-arrow');
    const rightArrow = document.querySelector('.hof-right-arrow');
    leftArrow?.addEventListener('click', () => rotateHof('left'));
    rightArrow?.addEventListener('click', () => rotateHof('right'));

    // Add click listeners to all member bubbles to feature them
    document.querySelectorAll('.hof-member').forEach(memberEl => {
        memberEl.addEventListener('click', () => {
            const index = parseInt(memberEl.dataset.index, 10);
            if (!isNaN(index)) {
                featureMemberByIndex(index);
            }
        });
    });
}

function updateCommunityCarousel() {
    const member = HOF_MEMBERS_DATA[currentCommunityIndex];
    const featuredCard = document.querySelector('#hof-featured .trading-card');
    if (!featuredCard || !member) return;

    featuredCard.dataset.xLink = member.xLink;
    featuredCard.querySelector('.pfp-link').href = member.xLink;
    const pfpImg = featuredCard.querySelector('.card-pfp-square img');
    pfpImg.src = member.img;
    pfpImg.alt = `${member.name} profile picture`;
    featuredCard.querySelector('.hof-name').textContent = member.name;

    const badgesContainer = featuredCard.querySelector('#hof-badges');
    badgesContainer.innerHTML = '';
    member.badges?.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge badge-${badge.type} badge-${badge.tier}`;
        // Add badge content if needed
        badgesContainer.appendChild(badgeEl);
    });
}

function rotateHof(direction) {
    const len = HOF_MEMBERS_DATA.length;
    if (direction === 'right') {
        currentCommunityIndex = (currentCommunityIndex + 1) % len;
    } else {
        currentCommunityIndex = (currentCommunityIndex - 1 + len) % len;
    }
    updateCommunityCarousel();
    resetCommunityAutoRotate();
}

function featureMemberByIndex(index) {
    if (index >= 0 && index < HOF_MEMBERS_DATA.length) {
        currentCommunityIndex = index;
        updateCommunityCarousel();
        resetCommunityAutoRotate();
    }
}

function resetCommunityAutoRotate() {
    clearInterval(communityAutoRotateInterval);
    communityAutoRotateInterval = setInterval(() => rotateHof('right'), 10000);
}


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
        audio.play().catch(e => console.log("Autoplay prevented.", e));
    }

    function togglePlayPause() {
        if (!audio.src) { // If no track is loaded, load the first one and play
             loadTrack(currentTrackIndex);
        } else if (audio.paused) {
            audio.play().catch(e => console.log("Play action was prevented.", e));
        } else {
            audio.pause();
        }
    }
    
    function updatePlayPauseIcons() {
        const isPaused = audio.paused || audio.ended;
        playPauseBtn.className = isPaused ? 'audio-btn play' : 'audio-btn pause';
        playPauseBtnMobile.className = isPaused ? 'audio-btn play' : 'audio-btn pause';
        audioPlayerMobile.classList.toggle('playing', !isPaused);
        if (trackInfoSpan) trackInfoSpan.style.animationPlayState = isPaused ? 'paused' : 'running';
        if (trackInfoMobileSpan) trackInfoMobileSpan.style.animationPlayState = isPaused ? 'paused' : 'running';
    }

    logoBtn?.addEventListener('click', () => {
        const isActive = audioPlayer.classList.toggle('active');
        logoBtn.classList.toggle('active', isActive);
        if (isActive && !audio.src) {
            loadTrack(currentTrackIndex);
        }
    });

    singlePlayButton?.addEventListener('click', () => {
        singlePlayButton.style.display = 'none';
        audioPlayerMobile.style.display = 'flex';
        togglePlayPause();
    });

    playPauseBtn?.addEventListener('click', togglePlayPause);
    playPauseBtnMobile?.addEventListener('click', togglePlayPause);
    
    const playNextTrack = () => {
        currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
        loadTrack(currentTrackIndex);
    };

    const playPrevTrack = () => {
        currentTrackIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        loadTrack(currentTrackIndex);
    };

    nextTrackBtn?.addEventListener('click', playNextTrack);
    nextTrackBtnMobile?.addEventListener('click', playNextTrack);
    prevTrackBtn?.addEventListener('click', playPrevTrack);
    prevTrackBtnMobile?.addEventListener('click', playPrevTrack);

    audio.addEventListener('play', updatePlayPauseIcons);
    audio.addEventListener('pause', updatePlayPauseIcons);
    audio.addEventListener('ended', playNextTrack);
    audio.addEventListener('error', () => {
        console.error("Audio playback error. Skipping to next track.");
        playNextTrack();
    });
}
