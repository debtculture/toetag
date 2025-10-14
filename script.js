document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE MATRIX BACKGROUND ---
    createMatrixEffect('matrix-bg', 'rgba(255, 59, 59, 0.4)', 'rgba(13, 13, 13, 0.05)');

    // --- 2. INITIALIZE LIVE TOKEN DATA ---
    const DEBT_TOKEN_ADDRESS = '9NQc7BnhfLbNwVFXrVsymEdqEFRuv5e1k7CuQW82pump';
    const INITIAL_SUPPLY = 1000000000;
    const VAULTED_SUPPLY = 150000000;

    async function fetchTokenData() {
        try {
            const overviewResponse = await fetch(`https://public-api.birdeye.so/public/overview/token/${DEBT_TOKEN_ADDRESS}`);
            if (!overviewResponse.ok) throw new Error('Failed to fetch token overview');
            const overviewData = (await overviewResponse.json()).data;

            // --- Safely format numbers ---
            const formatPrice = (price) => price ? `$${price.toPrecision(4)}` : 'N/A';
            const formatLargeNumber = (num) => num ? `$${Math.round(num).toLocaleString('en-US')}` : 'N/A';
            const formatTokenAmount = (num) => num ? Math.round(num).toLocaleString('en-US') : 'N/A';
            const formatPercent = (num) => num ? `${num.toFixed(2)}%` : 'N/A';

            // --- Calculations ---
            const currentSupply = overviewData.supply;
            const burnedAmount = INITIAL_SUPPLY - currentSupply;
            const tradableSupply = currentSupply - overviewData.liquidity - VAULTED_SUPPLY;
            const percentInCirc = (tradableSupply / currentSupply) * 100;

            // --- Update UI ---
            // Homepage Live Ticker
            if (document.getElementById('price-data')) {
                document.getElementById('price-data').textContent = formatPrice(overviewData.price);
                document.getElementById('market-cap-data').textContent = formatLargeNumber(overviewData.mc);
                document.getElementById('volume-data').textContent = formatLargeNumber(overviewData.v24h);
            }
            // Homepage Tokenomics Dashboard
            if (document.getElementById('tokenomics-mcap')) {
                document.getElementById('tokenomics-mcap').textContent = formatLargeNumber(overviewData.mc);
                document.getElementById('tokenomics-liquidity').textContent = formatLargeNumber(overviewData.liquidity);
                document.getElementById('tokenomics-burned').textContent = formatTokenAmount(burnedAmount);
            }
            // Dashboard Page Detailed Tokenomics
            if (document.getElementById('detailed-tokenomics-grid')) {
                 document.getElementById('detailed-tokenomics-grid').innerHTML = `
                    <div class="dashboard-item"><h3>Market Cap</h3><p>${formatLargeNumber(overviewData.mc)}</p></div>
                    <div class="dashboard-item"><h3>Price</h3><p>${formatPrice(overviewData.price)}</p></div>
                    <div class="dashboard-item"><h3>Liquidity</h3><p>${formatLargeNumber(overviewData.liquidity)}</p></div>
                    <div class="dashboard-item"><h3>24h Volume</h3><p>${formatLargeNumber(overviewData.v24h)}</p></div>
                    <div class="dashboard-item"><h3>Current Supply</h3><p>${formatTokenAmount(currentSupply)}</p></div>
                    <div class="dashboard-item"><h3>Total Burned</h3><p>${formatTokenAmount(burnedAmount)}</p></div>
                    <div class="dashboard-item"><h3>Tradable Supply</h3><p>${formatTokenAmount(tradableSupply)}</p></div>
                    <div class="dashboard-item"><h3>% of Supply Tradable</h3><p>${formatPercent(percentInCirc)}</p></div>
                `;
            }

        } catch (error) {
            console.error("Failed to fetch token data:", error);
            // Handle API failure gracefully
        }
    }

    // Fetch data immediately on load, then refresh every 60 seconds
    fetchTokenData();
    setInterval(fetchTokenData, 60000);

    // --- 3. FREEDOM CALCULATOR LOGIC ---
    const debtAmountInput = document.getElementById('debt-amount');
    const targetPriceInput = document.getElementById('target-price');
    const calculatedValueOutput = document.getElementById('calculated-value');

    function calculateFreedom() {
        if (debtAmountInput && targetPriceInput && calculatedValueOutput) {
            const amount = parseFloat(debtAmountInput.value) || 0;
            const price = parseFloat(targetPriceInput.value) || 0;
            const totalValue = amount * price;
            
            calculatedValueOutput.textContent = totalValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }

    if (debtAmountInput && targetPriceInput) {
        debtAmountInput.addEventListener('input', calculateFreedom);
        targetPriceInput.addEventListener('input', calculateFreedom);
    }
    
    // --- 4. FAQ ACCORDION LOGIC ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');

                accordionHeaders.forEach(h => {
                    h.classList.remove('active');
                    h.nextElementSibling.style.maxHeight = null;
                });

                if (!isActive) {
                    header.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }

    // --- 5. FOOTER COPY-TO-CLIPBOARD UTILITY ---
    const footerContract = document.querySelector('.footer-contract p');
    if (footerContract) {
        footerContract.addEventListener('click', () => {
            const contractAddress = footerContract.textContent.replace('Contract Address: ', '').trim();
            navigator.clipboard.writeText(contractAddress).then(() => {
                const originalText = footer-contract.textContent;
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
    // ... (Matrix function code remains the same as before) ...
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
