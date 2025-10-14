document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE MATRIX BACKGROUND ---
    createMatrixEffect('matrix-bg', 'rgba(255, 59, 59, 0.4)', 'rgba(13, 13, 13, 0.05)');

    // --- 2. INITIALIZE LIVE TOKEN DATA ---
    const DEBT_TOKEN_ADDRESS = '9NQc7BnhfLbNwVFXrVsymEdqEFRuv5e1k7CuQW82pump';
    const INITIAL_SUPPLY = 1000000000;

    async function fetchTokenData() {
        try {
            // Using Birdeye's public API - no key needed.
            const response = await fetch(`https://public-api.birdeye.so/public/price?address=${DEBT_TOKEN_ADDRESS}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const apiData = await response.json();
            const tokenData = apiData.data;

            // Fetch additional details like MCAP and Supply
            const detailResponse = await fetch(`https://public-api.birdeye.so/public/overview/token/${DEBT_TOKEN_ADDRESS}`);
            if (!detailResponse.ok) throw new Error('Failed to fetch token details');

            const detailData = await detailResponse.json();
            const overviewData = detailData.data;

            // --- Safely format numbers ---
            const formatPrice = (price) => price ? `$${price.toPrecision(4)}` : 'N/A';
            const formatLargeNumber = (num) => num ? `$${Math.round(num).toLocaleString('en-US')}` : 'N/A';
            const formatTokenAmount = (num) => num ? Math.round(num).toLocaleString('en-US') : 'N/A';

            // --- Calculate Burned Amount ---
            const currentSupply = overviewData.supply;
            const burnedAmount = INITIAL_SUPPLY - currentSupply;

            // --- Update the UI ---
            // Ticker Data
            document.getElementById('price-data').textContent = formatPrice(tokenData.value);
            document.getElementById('market-cap-data').textContent = formatLargeNumber(overviewData.mc);
            document.getElementById('volume-data').textContent = formatLargeNumber(overviewData.v24h);

            // Tokenomics Dashboard Data
            document.getElementById('tokenomics-mcap').textContent = formatLargeNumber(overviewData.mc);
            document.getElementById('tokenomics-liquidity').textContent = formatLargeNumber(overviewData.liquidity);
            document.getElementById('tokenomics-burned').textContent = formatTokenAmount(burnedAmount);

        } catch (error) {
            console.error("Failed to fetch token data:", error);
            // If API fails, display an error on all fields
            const errorText = 'Unavailable';
            document.getElementById('price-data').textContent = errorText;
            document.getElementById('market-cap-data').textContent = errorText;
            document.getElementById('volume-data').textContent = errorText;
            document.getElementById('tokenomics-mcap').textContent = errorText;
            document.getElementById('tokenomics-liquidity').textContent = errorText;
            document.getElementById('tokenomics-burned').textContent = errorText;
        }
    }

    // Fetch data immediately on load, then refresh every 60 seconds
    fetchTokenData();
    setInterval(fetchTokenData, 60000);

    // --- 3. FOOTER COPY-TO-CLIPBOARD UTILITY ---
    const footerContract = document.querySelector('.footer-contract p');
    if (footerContract) {
        footerContract.addEventListener('click', () => {
            const contractAddress = footerContract.textContent.replace('Contract Address: ', '').trim();
            navigator.clipboard.writeText(contractAddress).then(() => {
                const originalText = footerContract.textContent;
                footerContract.textContent = 'Copied to clipboard!';
                setTimeout(() => {
                    footerContract.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy contract address: ', err);
            });
        });
    }

});

// --- MATRIX EFFECT FUNCTION ---
function createMatrixEffect(canvasId, charColor, overlayColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01';
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array(columns).fill(1).map(() => Math.random() * canvas.height);

    function draw() {
        ctx.fillStyle = overlayColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = charColor;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let intervalId = setInterval(draw, 50);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalculate drops on resize
        for(let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    });
}
