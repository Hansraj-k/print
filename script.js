function updateGridLayout() {
    const layout = document.getElementById('layout');
    layout.innerHTML = '';
    const gridSelect = document.getElementById('grid-select');
    const gridValue = parseInt(gridSelect.value);
    let columns, rows;
    
    switch(gridValue) {
        case 1:
            columns = rows = 1;
            break;
        case 2:
            columns = 1; rows = 2;
            break;
        case 4:
            columns = rows = 2;
            break;
        case 8:
            columns = 2; rows = 4;
            break;
        case 9:
            columns = rows = 3;
            break;
        case 12:
            columns = 3; rows = 4;
            break;
        case 16:
            columns = rows = 4;
            break;
        default:
            columns = rows = 1;
    }

    layout.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    layout.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let i = 1; i <= gridValue; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.id = `image-container-${i}`;

        cell.appendChild(imageContainer);
        layout.appendChild(cell);
    }
}

document.getElementById('imageInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const gridSelect = document.getElementById('grid-select');
    const gridValue = parseInt(gridSelect.value);

    for (let i = 0; i < Math.min(files.length, gridValue); i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.id = `image-${i + 1}`;
            img.setAttribute('data-rotation', 0);
            img.style.position = 'absolute';

            img.onload = function() {
                const imageContainer = document.getElementById(`image-container-${i + 1}`);
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
                
                const controlButtons = document.createElement('div');
                controlButtons.className = 'control-buttons';

                const rotateButton = document.createElement('button');
                rotateButton.innerText = 'Rotate';
                rotateButton.onclick = function() {
                    let currentRotation = img.getAttribute('data-rotation') || 0;
                    currentRotation = (parseInt(currentRotation) + 90) % 360;
                    img.style.transform = `rotate(${currentRotation}deg)`;
                    img.setAttribute('data-rotation', currentRotation);
                };

                const minimizeButton = document.createElement('button');
                minimizeButton.innerText = '-';
                minimizeButton.onclick = function() {
                    img.style.width = (img.clientWidth * 0.9) + 'px';
                    img.style.height = (img.clientHeight * 0.9) + 'px';
                };

                const maximizeButton = document.createElement('button');
                maximizeButton.innerText = '+';
                maximizeButton.onclick = function() {
                    img.style.width = (img.clientWidth * 1.1) + 'px';
                    img.style.height = (img.clientHeight * 1.1) + 'px';
                };

                controlButtons.appendChild(rotateButton);
                controlButtons.appendChild(minimizeButton);
                controlButtons.appendChild(maximizeButton);

                imageContainer.appendChild(controlButtons);

                // Make the image draggable
                dragElement(img);
            }
        }
        reader.readAsDataURL(file);
    }
});

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function printImage() {
    window.print();
}

function downloadLayout() {
    // Hide control buttons
    const controlButtons = document.querySelectorAll('.control-buttons');
    controlButtons.forEach(buttons => buttons.style.display = 'none');

    html2canvas(document.querySelector("#layout"), { scale: 4 }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = 'layout.png';
        link.click();

        // Show control buttons again
        controlButtons.forEach(buttons => buttons.style.display = 'flex');
    });
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}

// Initialize the grid layout
updateGridLayout();