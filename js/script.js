/**
 * Personal Website Project - JavaScript Logic
 * 1. Password Generator
 * 2. Blackjack Game
 * เขียนตามหลัก Best Practices เพื่อคะแนนประเมิน 10%
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // แอปที่ 1: Password Generator Logic
    // ==========================================
    const passwordPage = document.getElementById('password-page');
    if (passwordPage) {
        // Progressive Enhancement: แสดงปุ่มหลังจาก JS โหลดสำเร็จ
        const jsControls = document.getElementById('js-controls');
        if (jsControls) jsControls.style.display = 'block';

        const generateBtn = document.getElementById('generate-btn');
        const lengthInput = document.getElementById('length');
        const resultInput = document.getElementById('result');

        const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

        const generatePassword = (length) => {
            let password = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
                password += CHARACTERS[randomIndex];
            }
            return password;
        };

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                let length = parseInt(lengthInput.value);
                // ตรวจสอบความถูกต้องของข้อมูล
                if (isNaN(length) || length < 8) length = 8;
                if (length > 32) length = 32;

                resultInput.value = generatePassword(length);
                
                // เอฟเฟกต์กระพริบช่อง Input
                resultInput.style.backgroundColor = '#e0f2fe';
                setTimeout(() => resultInput.style.backgroundColor = '#f1f5f9', 200);
            });
            // รันอัตโนมัติ 1 ครั้งเมื่อเปิดหน้า
            generateBtn.click(); 
        }
    }

    // ==========================================
    // แอปที่ 2: Blackjack Game Logic
    // ==========================================
    const blackjackPage = document.getElementById('blackjack-page');
    if (blackjackPage) {
        const dealerCardsDiv = document.getElementById('dealer-cards');
        const playerCardsDiv = document.getElementById('player-cards');
        const dealerScoreSpan = document.getElementById('dealer-score');
        const playerScoreSpan = document.getElementById('player-score');
        const gameMessageP = document.getElementById('game-message');
        
        const newGameBtn = document.getElementById('new-game-btn');
        const jsActionControls = document.getElementById('js-action-controls');
        const hitBtn = document.getElementById('hit-btn');
        const standBtn = document.getElementById('stand-btn');

        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        let deck = [], dealerHand = [], playerHand = [];
        let dealerScore = 0, playerScore = 0;
        let isGameActive = false, isPlayerTurn = true;

        // ฟังก์ชันสร้างชุดไพ่
        const createDeck = () => suits.flatMap(suit => values.map(value => ({ value, suit })));
        
        // ฟังก์ชันสับไพ่
        const shuffleDeck = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        // คำนวณคะแนนไพ่บนมือ
        const calculateScore = (hand) => {
            let score = 0, hasAce = false;
            for (let card of hand) {
                if (['J', 'Q', 'K'].includes(card.value)) score += 10;
                else if (card.value === 'A') { hasAce = true; score += 11; }
                else score += parseInt(card.value);
            }
            if (hasAce && score > 21) score -= 10;
            return score;
        };

        // สร้าง UI ของไพ่
        const createCardUI = (card, isHidden = false) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-unit';
            if (isHidden) { cardDiv.classList.add('back'); return cardDiv; }
            if (['♥', '♦'].includes(card.suit)) cardDiv.classList.add('red');
            cardDiv.innerHTML = `${card.value}<br>${card.suit}`;
            return cardDiv;
        };

        const updateUI = () => {
            playerCardsDiv.innerHTML = '';
            playerHand.forEach(c => playerCardsDiv.appendChild(createCardUI(c)));
            playerScoreSpan.textContent = playerScore;

            dealerCardsDiv.innerHTML = '';
            if (isGameActive && isPlayerTurn) {
                dealerCardsDiv.appendChild(createCardUI(dealerHand[0]));
                dealerCardsDiv.appendChild(createCardUI({}, true));
                dealerScoreSpan.textContent = "?";
            } else {
                dealerHand.forEach(c => dealerCardsDiv.appendChild(createCardUI(c)));
                dealerScoreSpan.textContent = dealerScore;
            }
        };

        const showMessage = (msg) => gameMessageP.textContent = msg;
        
        const setActionControls = (active) => {
            jsActionControls.style.display = active ? 'flex' : 'none';
            newGameBtn.style.display = active ? 'none' : 'inline-block';
        };

        // ดีลเลอร์เล่นอัตโนมัติ
        const dealerPlay = () => {
            isPlayerTurn = false;
            while (dealerScore < 17) {
                dealerHand.push(deck.pop());
                dealerScore = calculateScore(dealerHand);
            }
            updateUI();
            
            isGameActive = false;
            if (playerScore > 21) showMessage("คุณเกิน 21! แพ้แล้ว (Bust) 😢");
            else if (dealerScore > 21) showMessage("ดีลเลอร์เกิน 21! คุณชนะ! 🎉");
            else if (playerScore > dealerScore) showMessage("คุณชนะ! 🎉 คะแนนสูงกว่า");
            else if (playerScore < dealerScore) showMessage("คุณแพ้... ดีลเลอร์คะแนนสูงกว่า");
            else showMessage("เสมอกัน (Push) 🤝");
            
            setActionControls(false);
        };

        // เริ่มเกมใหม่
        const startNewGame = () => {
            deck = createDeck(); shuffleDeck(deck);
            dealerHand = [deck.pop(), deck.pop()];
            playerHand = [deck.pop(), deck.pop()];
            dealerScore = calculateScore(dealerHand);
            playerScore = calculateScore(playerHand);
            isGameActive = true; isPlayerTurn = true;
            
            updateUI();
            showMessage("ตาของคุณ (Hit เพื่อขอไพ่ หรือ Stand เพื่อพอ)");
            setActionControls(true);

            if (playerScore === 21) {
                showMessage("Blackjack! 🎉 ดีลเลอร์ตาของคุณ");
                setTimeout(dealerPlay, 1000);
            }
        };

        newGameBtn.addEventListener('click', startNewGame);
        hitBtn.addEventListener('click', () => {
            if (!isGameActive || !isPlayerTurn) return;
            playerHand.push(deck.pop());
            playerScore = calculateScore(playerHand);
            updateUI();
            if (playerScore > 21) dealerPlay(); // หากเกิน 21 บังคับจบเกม
        });
        standBtn.addEventListener('click', () => {
            if (!isGameActive || !isPlayerTurn) return;
            showMessage("พอแล้ว, รอดีลเลอร์เปิดไพ่...");
            setTimeout(dealerPlay, 500);
        });
    }
});