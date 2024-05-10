const rows = 9;
const cols = 16;
const size = rows * cols;
let imageParts = [];
let imageWidth = 1024;
let imageHeight = 576;

window.onload = function() {
    initImageParts();
    renderGrid();
    initializeSoundDetection();
    initializeGlitchEffect();
};

function initImageParts() {
    const partWidth = imageWidth / cols;
    const partHeight = imageHeight / rows;

    for (let i = 0; i < size; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const xPos = -(col * partWidth);
        const yPos = -(row * partHeight);
        imageParts.push({ x: xPos, y: yPos });
    }
}

function renderGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';

    for (let i = 0; i < size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = `${imageWidth / cols}px`;
        cell.style.height = `${imageHeight / rows}px`;
        cell.style.backgroundImage = `url('/image/beach.jpg')`;
        cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
        cell.style.backgroundPosition = `${imageParts[i].x}px ${imageParts[i].y}px`;
        gridContainer.appendChild(cell);
    }
}

function initializeSoundDetection() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkSound = () => {
                requestAnimationFrame(checkSound);
                analyser.getByteFrequencyData(dataArray);
                const average = getAverageVolume(dataArray);
                if (average > 100) {
                    shuffle();
                    glitchEffectOn();
                }
            };

            checkSound();
        })
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
        });
}

function getAverageVolume(array) {
    let values = 0;
    const length = array.length;
    for (let i = 0; i < length; i++) {
        values += array[i];
    }
    return values / length;
}

const sentences = [
    "If You're Happy and You Know it Clap Your Hands, if You're Happy and You Know it Clap Your Hands, if You're Happy and You Know it and You Really Wanna Show it, if You're Happy and You Know it Clap Your Hands.",
    "如果你快乐，你知道，拍拍你的手，如果你快乐，你知道，拍拍你的手，如果你快乐，你知道，你真的想表现出来，如果你快乐，你知道，拍拍你的手。它拍拍你的手。",
    "Если ты счастлив и знаешь это, хлопай в ладоши, если ты счастлив и знаешь это, хлопай в ладоши, если ты счастлив, и ты это знаешь, и действительно хочешь это показать, если ты счастлив и знаешь это это Хлопайте в ладоши.",
    "あなたが幸せで、それがわかっているなら、手をたたきましょう、あなたが幸せで、それがわかっているなら、手をたたきなさい、あなたが幸せで、それがわかっていて、本当にそれを見せたいのなら、あなたが幸せで、わかっているならクラップ・ユア・ハンズです。",
    "Si vous êtes heureux et que vous le savez, tapez dans vos mains, si vous êtes heureux et vous le savez, frappez dans vos mains, si vous êtes heureux et que vous le savez et que vous voulez vraiment le montrer, si vous êtes heureux et que vous le savez il applaudit dans vos mains.",
    "Wenn Sie glücklich sind und es wissen, klatschen Sie in die Hände, wenn Sie glücklich sind und es wissen, klatschen Sie in die Hände, wenn Sie glücklich sind und es wissen und es wirklich zeigen wollen, wenn Sie glücklich sind und es wissen Es klatscht in die Hände.",
    "إذا كنت سعيدًا وأنت تعرف ذلك، صفق بيديك، إذا كنت سعيدًا وأنت تعرف ذلك، صفق بيديك، إذا كنت سعيدًا وأنت تعرف ذلك وتريد حقًا إظهار ذلك، إذا كنت سعيدًا وأنت تعرف ذلك إنه يصفق بيديك.",
    "אם אתה שמח ואתה יודע את זה תמחא כפיים, אם אתה שמח ואתה יודע את זה מחא כפיים, אם אתה שמח ואתה יודע את זה ואתה באמת רוצה להראות את זה, אם אתה שמח ואתה יודע זה מחא כפיים.",
    "Nếu bạn hạnh phúc và bạn biết điều đó hãy vỗ tay, nếu bạn hạnh phúc và bạn biết điều đó hãy vỗ tay, nếu bạn hạnh phúc và bạn biết điều đó và bạn thực sự muốn thể hiện điều đó, nếu bạn hạnh phúc và bạn biết điều đó nó vỗ tay.",
    "Se sei felice e lo sai batti le mani, se sei felice e lo sai batti le mani, se sei felice e lo sai e vuoi davvero dimostrarlo, se sei felice e lo sai batte le mani.",
    "당신이 행복하고 그것을 알고 있다면 손뼉을 치세요, 당신이 행복하고 그것을 알고 있다면 박수를 쳐 주세요, 당신이 행복하고 당신이 그것을 알고 있고 당신이 정말로 그것을 보여주고 싶다면 당신이 행복하고 당신이 알고 있다면 박수를 쳐주세요 그것은 박수를 쳐라.",
    "Si beatus es, et scis, plaude manus, si beatus es, et tu scis, plaude manus, si beatus es et scis, et vere pretii ostende, si beatus es et scis. Plaudite manibus.",
    "Jika Kamu Senang dan Kamu Tahu Itu Tepuk Tanganmu, Jika Kamu Senang dan Kamu Tahu Itu Tepuk Tanganmu, Jika Kamu Senang dan Kamu Tahu Itu dan Kamu Benar-benar Ingin Menunjukkannya, Jika Kamu Senang dan Kamu Tahu itu Tepuk Tanganmu.",
    "Ef þú ert hamingjusamur og þú veist það, klappaðu höndum þínum, ef þú ert ánægður og þú veist það, klappaðu höndunum, ef þú ert hamingjusamur og þú veist það og þú vilt virkilega sýna það, ef þú ert ánægður og þú veist það klappa höndunum.",
    "As jy gelukkig is en jy weet dit, klap jou hande, as jy gelukkig is en jy weet dit, klap jou hande, as jy gelukkig is en jy weet dit en jy wil dit regtig wys, as jy gelukkig is en jy weet dit Klap Jou Hande.",
    "မင်းပျော်ရင် မင်းသိရင်လက်ခုတ်တီး၊ မင်းပျော်ရင်သိရင်လက်ခုတ်တီး၊ မင်းပျော်ရင်သိပြီး တကယ်ပြချင်တယ် မင်းပျော်ရင် မင်းသိမှာပါ လက်ခုပ်တီးပါ။",
    "如果你快樂，你知道，拍拍你的手，如果你快樂，你知道，拍拍你的手，如果你快樂，你知道，你真的想表現出來，如果你快樂，你知道，拍拍你的手。",
];

let currentSentenceIndex = 0;

function shuffle() {

    const randomIndex = Math.floor(Math.random() * sentences.length);
    const newSentence = sentences[randomIndex];
    
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.textContent = newSentence;

    for (let i = imageParts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageParts[i], imageParts[j]] = [imageParts[j], imageParts[i]];
    }
    renderGrid();
    glitchEffectOn();
}

function initializeGlitchEffect() {
    const cnv = document.createElement('canvas');
    cnv.id = 'glitch_canvas';
    cnv.width = imageWidth;
    cnv.height = imageHeight;
    cnv.style.display = 'none';
    document.body.appendChild(cnv);
}

function glitchEffectOn() {
    const cnv = document.getElementById('glitch_canvas');
    const ctx = cnv.getContext('2d');
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
        const img_data = cnv.toDataURL("image/jpeg");
        const glitched_img = new Image();
        glitched_img.src = glitchify(img_data, 96, 6);
        glitched_img.onload = function() {
            ctx.clearRect(0, 0, imageWidth, imageHeight);
            ctx.drawImage(glitched_img, 0, 0, imageWidth, imageHeight);
            cnv.style.display = 'block';
        };
    };
    img.src = '/image/beach.jpg';
}

function glitchify(data, chunk_max, repeats) {
    const rand_int = max => Math.floor(Math.random() * max);
    const chunk_size = rand_int(chunk_max / 4) * 4;
    const i = rand_int(data.length - 24 - chunk_size) + 24;
    const front = data.slice(0, i);
    const back = data.slice(i + chunk_size, data.length);
    const result = front + back;
    return repeats === 0 ? result : glitchify(result, chunk_max, repeats - 1);
}