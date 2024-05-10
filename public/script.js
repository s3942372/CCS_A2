// As I had used a 16:9 sized image, I had divided the image grids into 9 rows and 16 columns so that it's all evenly divided into the same sized grids.
// I then set the image width and height into a 16:9 aspect ratio that would allow for the main image to be a good size on the screen.
const rows = 9;
const cols = 16;
const size = rows * cols;
let imageParts = [];
let imageWidth = 1024;
let imageHeight = 576;

// When the window finishes loading, all the functions are also initialised so that the webpage works as intended.
window.onload = function() {
    initImageParts();
    renderGrid();
    initializeSoundDetection();
    initializeGlitchEffect();
};

// Calculates out where the rows and columns making up the grids will go on my image.
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

// Works in tandem with the previous code to actually separate my image into the grids calculated out by the previous function.
// This allows me to shuffle all the grids later.
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

// Sees if the media/webpage allows for the microphone (e.g. Chrome and Edge does, but DuckDuckGo doesn't).
function initializeSoundDetection() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported');
        return;
    }

    // Asks for access to the microphone. Consent is key since some people (like me) are paranoid about being recorded in any way.
    navigator.mediaDevices.getUserMedia({ audio: true })

    // The following code basically makes it so that the audio picked up by the micrphone is converted into data that is then analysed to see if crosses a certain threshold I've set as the average (100 in this case).
    // If it is determined to have crossed the threshold then the glitch, scramble and button effects and changes are triggered.
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

                // This makes it so that not every little sound will trigger the visual effects and so the user can play around as much as they want and make purposeful changes to the visual elements on screen.
                // Both the shuffle and glitch function will be triggered by this, alongside the other visual effects I've linked too them.
                // Actually I've now changed it so that only the shuffle function is set to be triggered here seeing how the glitch function is already linked to the function further down, it would be redundant to keep it here too.
                if (average > 100) {
                    shuffle();
                }
            };
            checkSound();
        })

        // Logs an error in the console if the user denies microphone access.
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
        });
}

// Analyses and calculates the volume of the surroundings.
function getAverageVolume(array) {
    let values = 0;
    const length = array.length;
    for (let i = 0; i < length; i++) {
        values += array[i];
    }
    return values / length;
}

// Initializes the 'sentences' array.
// It contains multiple strings, each of which are the lyrics to the song "If You're Happy and You Know It" translated to different languages via Google Translate.
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

// Keeps track of the number of the string displayed. It's set to 0, so what's currently displayed is the initial sentence typed on the shuffle button.
let currentSentenceIndex = 0;

// The shuffle button and effect.
// I've set it so that every visual effect is in fact triggered by the shuffle button.
// A new sentence from the string is shown on click, the grids are shuffled randomly on click and even the glitch effect is linked so that everything occurs at the same time.
function shuffle() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const newSentence = sentences[randomIndex];
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.textContent = newSentence;
    for (let i = imageParts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageParts[i], imageParts[j]] = [imageParts[j], imageParts[i]];
    }

    // Have to have this here so that the grids can be separated and shuffled.
    renderGrid();
    glitchEffectOn();
}

// Creates a hidden canvas element the same size is the one that initially appears when the webpage window is loaded.
// This canvas will appear when the shuffle function is triggered, and is the canvas where the glitch effect will take place.
function initializeGlitchEffect() {
    const cnv = document.createElement('canvas');
    cnv.id = 'glitch_canvas';
    cnv.width = imageWidth;
    cnv.height = imageHeight;
    cnv.style.display = 'none';
    document.body.appendChild(cnv);
}

// Makes it so that the glitch effect will occur on the glitch canvas.
function glitchEffectOn() {
    const cnv = document.getElementById('glitch_canvas');
    const ctx = cnv.getContext('2d');
    const img = new Image();

    // All this is really explained in the week 5 homework task.
    img.onload = function() {
        
        // Tells the function where to draw glitches.
        ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

        // Places the image I used onto the canvas so that then the glitch effect can be applied to it and everything can be visible.
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

// The glitch effect itself.
// Again, fully explained in week 5.
// Generates random chunk sizes for the glitch then works together with the previous function to create a glitched image.
function glitchify(data, chunk_max, repeats) {
    const rand_int = max => Math.floor(Math.random() * max);
    const chunk_size = rand_int(chunk_max / 4) * 4;
    const i = rand_int(data.length - 24 - chunk_size) + 24;
    const front = data.slice(0, i);
    const back = data.slice(i + chunk_size, data.length);
    const result = front + back;
    return repeats === 0 ? result : glitchify(result, chunk_max, repeats - 1);
}

// Sorry, the laptop is having too many issues and I want to upload this before it decides to die and take everything down with it in the process.
// If these notes are still here that probably means the laptop did just that and I couldn't update.