// Gesture Music App - Script Principal
class GestureMusicApp {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.audioCanvas = null;
        this.audioCtx = null;

        // Audio
        this.synth = null;
        this.filter = null;
        this.distortion = null;
        this.isAudioStarted = false;
        this.currentNote = false;
        this.audioInitialized = false;

        // Hand tracking
        this.hand1 = null;
        this.hand2 = null;
        this.hand1Role = 'notes';
        this.hand2Role = 'effects';

        // Gesture detection
        this.fingerStates = {
            thumb: false,
            index: false,
            middle: false,
            ring: false,
            pinky: false
        };

        // Audio parameters
        this.audioParams = {
            filterCutoff: 1000,
            distortion: 0,
            volume: 50
        };

        // Presets
        this.presets = this.loadPresets();

        this.init();
    }

    async init() {
        try {
            await this.setupCamera();
            await this.setupMediaPipe();
            this.setupAudio();
            this.setupUI();
            this.setupEventListeners();
            this.startHandTracking();
            this.startAudioVisualization();
            this.updatePresetList();

            console.log('Gesture Music App initialisé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.updateStatus('camera-status', '❌ Erreur', 'error');
        }
    }

    async setupCamera() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });

            this.video.srcObject = stream;
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.updateStatus('camera-status', '✅ Actif', 'success');
            };

        } catch (error) {
            throw new Error('Impossible d\'accéder à la caméra: ' + error.message);
        }
    }

    async setupMediaPipe() {
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
            this.processHandResults(results);
        });

        this.camera = new Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({ image: this.video });
            },
            width: 640,
            height: 480
        });
    }

    setupAudio() {
        // Indiquer que l'audio est prêt à être démarré par un geste utilisateur
        this.updateStatus('audio-status', '🔇 Prêt', 'ready');
    }

    setupUI() {
        // Initialiser les contrôles
        this.updateParameterDisplay();
        this.updateFingerStatus();
    }

    setupEventListeners() {
        // Boutons audio
        document.getElementById('start-audio').addEventListener('click', () => this.startAudio());
        document.getElementById('stop-audio').addEventListener('click', () => this.stopAudio());
        document.getElementById('test-audio').addEventListener('click', () => this.testAudio());

        // Assignation des mains
        document.getElementById('hand1-role').addEventListener('change', (e) => {
            this.hand1Role = e.target.value;
        });

        document.getElementById('hand2-role').addEventListener('change', (e) => {
            this.hand2Role = e.target.value;
        });

        // Contrôles de paramètres
        document.getElementById('filter-cutoff').addEventListener('input', (e) => {
            this.audioParams.filterCutoff = parseInt(e.target.value);
            this.filter.frequency.value = this.audioParams.filterCutoff;
            this.updateParameterDisplay();
        });

        document.getElementById('distortion').addEventListener('input', (e) => {
            this.audioParams.distortion = parseInt(e.target.value);
            if (this.distortion) {
                this.distortion.distortion = this.audioParams.distortion / 100;
            }
            this.updateParameterDisplay();
        });

        document.getElementById('volume').addEventListener('input', (e) => {
            const volumePercent = parseInt(e.target.value);
            this.audioParams.volume = volumePercent;
            if (typeof Tone !== 'undefined') {
                Tone.Destination.volume.value = Tone.gainToDb(volumePercent / 100);
            }
            this.updateParameterDisplay();
        });

        // Gestion des presets
        document.getElementById('save-preset').addEventListener('click', () => this.savePreset());
        document.getElementById('load-preset').addEventListener('click', () => this.loadPreset());
        document.getElementById('delete-preset').addEventListener('click', () => this.deletePreset());

        // PWA Install
        this.setupPWAInstall();
    }

    startHandTracking() {
        this.camera.start();
    }

    processHandResults(results) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (results.multiHandLandmarks) {
            // Dessiner les landmarks
            this.drawHands(results.multiHandLandmarks, results.multiHandedness);

            // Traiter les mains détectées
            this.processHands(results.multiHandLandmarks, results.multiHandedness);
        }

        this.ctx.restore();
    }

    drawHands(landmarks, handedness) {
        landmarks.forEach((landmark, index) => {
            const isLeftHand = handedness[index].label === 'Left';
            const hand = isLeftHand ? 'hand1' : 'hand2';

            // Dessiner les connexions
            this.drawConnections(landmark, isLeftHand);

            // Dessiner les landmarks
            landmark.forEach((point, pointIndex) => {
                const x = point.x * this.canvas.width;
                const y = point.y * this.canvas.height;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
                this.ctx.fillStyle = isLeftHand ? '#3b82f6' : '#ef4444';
                this.ctx.fill();

                // Numéroter les points
                this.ctx.fillStyle = 'white';
                this.ctx.font = '10px Arial';
                this.ctx.fillText(pointIndex.toString(), x + 6, y - 6);
            });
        });
    }

    drawConnections(landmark, isLeftHand) {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Pouce
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [5, 9], [9, 10], [10, 11], [11, 12], // Majeur
            [9, 13], [13, 14], [14, 15], [15, 16], // Annulaire
            [13, 17], [17, 18], [18, 19], [19, 20], // Auriculaire
            [0, 17] // Base
        ];

        this.ctx.strokeStyle = isLeftHand ? '#3b82f6' : '#ef4444';
        this.ctx.lineWidth = 2;

        connections.forEach(([start, end]) => {
            const startPoint = landmark[start];
            const endPoint = landmark[end];

            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.x * this.canvas.width, startPoint.y * this.canvas.height);
            this.ctx.lineTo(endPoint.x * this.canvas.width, endPoint.y * this.canvas.height);
            this.ctx.stroke();
        });
    }

    processHands(landmarks, handedness) {
        // Réinitialiser les états des doigts
        Object.keys(this.fingerStates).forEach(finger => {
            this.fingerStates[finger] = false;
        });

        landmarks.forEach((landmark, index) => {
            const isLeftHand = handedness[index].label === 'Left';
            const hand = isLeftHand ? 'hand1' : 'hand2';

            // Calculer les angles des doigts
            const fingerAngles = this.calculateFingerAngles(landmark);

            // Mettre à jour les états des doigts
            this.updateFingerStates(fingerAngles);

            // Contrôler l'audio selon le rôle de la main
            this.controlAudio(hand, landmark, fingerAngles);
        });

        this.updateFingerStatus();
    }

    calculateFingerAngles(landmark) {
        const angles = {};

        // Index (4, 5, 6, 7, 8)
        angles.index = this.calculateAngle(
            landmark[5], landmark[6], landmark[7]
        );

        // Majeur (8, 9, 10, 11, 12)
        angles.middle = this.calculateAngle(
            landmark[9], landmark[10], landmark[11]
        );

        // Annulaire (12, 13, 14, 15, 16)
        angles.ring = this.calculateAngle(
            landmark[13], landmark[14], landmark[15]
        );

        // Auriculaire (16, 17, 18, 19, 20)
        angles.pinky = this.calculateAngle(
            landmark[17], landmark[18], landmark[19]
        );

        // Pouce (0, 1, 2, 3, 4)
        angles.thumb = this.calculateAngle(
            landmark[1], landmark[2], landmark[3]
        );

        return angles;
    }

    calculateAngle(p1, p2, p3) {
        const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
        const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

        const angle = Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
        return angle;
    }

    updateFingerStates(fingerAngles) {
        Object.keys(fingerAngles).forEach(finger => {
            this.fingerStates[finger] = fingerAngles[finger] > 160;
        });
    }

    controlAudio(hand, landmark, fingerAngles) {
        if (!this.isAudioStarted) return;

        const handRole = hand === 'hand1' ? this.hand1Role : this.hand2Role;

        switch (handRole) {
            case 'notes':
                this.controlNotes(landmark, fingerAngles);
                break;
            case 'effects':
                this.controlEffects(landmark, fingerAngles);
                break;
            case 'volume':
                this.controlVolume(landmark, fingerAngles);
                break;
        }
    }

    controlNotes(landmark, fingerAngles) {
        // Jouer une note seulement si l'index est étendu
        if (fingerAngles.index > 160) {
            // Calculer la fréquence basée sur la position Y de la main
            const wristY = landmark[0].y;
            const frequency = 220 + (1 - wristY) * 880; // 220Hz à 1100Hz

            // Calculer le volume basé sur la position X
            const wristX = landmark[0].x;
            const velocity = 0.3 + (1 - Math.abs(wristX - 0.5) * 2) * 0.7;

            // Vérifier si une note est déjà en cours
            if (!this.currentNote) {
                this.synth.triggerAttack(frequency, undefined, velocity);
                this.currentNote = true;
                this.updateStatus('note-status', `🎵 ${frequency.toFixed(0)}Hz`, 'success');
                console.log(`Note jouée: ${frequency.toFixed(1)}Hz, vélocité: ${velocity.toFixed(2)}`);
            }
        } else {
            // Arrêter la note si l'index n'est plus étendu
            if (this.currentNote) {
                this.synth.triggerRelease();
                this.currentNote = false;
                this.updateStatus('note-status', '—', 'ready');
                console.log('Note arrêtée');
            }
        }
    }

    controlEffects(landmark, fingerAngles) {
        // Contrôler le filtre avec les mouvements horizontaux
        const wristX = landmark[0].x;
        const filterCutoff = 100 + wristX * 1900; // 100Hz à 2000Hz
        if (this.filter) {
            this.filter.frequency.value = filterCutoff;
        }

        // Contrôler la distorsion avec les mouvements verticaux
        const wristY = landmark[0].y;
        const distortion = wristY * 100; // 0% à 100%
        if (this.distortion) {
            this.distortion.distortion = distortion / 100;
        }

        // Mettre à jour l'affichage
        this.audioParams.filterCutoff = Math.round(filterCutoff);
        this.audioParams.distortion = Math.round(distortion);
        this.updateParameterDisplay();
    }

    controlVolume(landmark, fingerAngles) {
        // Contrôler le volume avec la position Y de la main
        const wristY = landmark[0].y;
        const volume = wristY; // 0 à 1
        Tone.Destination.volume.value = Tone.gainToDb(volume);

        this.audioParams.volume = Math.round(volume * 100);
        this.updateParameterDisplay();
    }

    async startAudio() {
        if (this.isAudioStarted) return;

        if (typeof Tone === 'undefined') {
            alert('Tone.js n\'est pas chargé');
            return;
        }

        // Créer et initialiser la chaîne audio à la première interaction utilisateur
        if (!this.audioInitialized) {
            await Tone.start();

            this.synth = new Tone.Synth({
                oscillator: { type: 'sawtooth' },
                envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.8 }
            });

            this.filter = new Tone.Filter({
                type: 'lowpass',
                frequency: this.audioParams.filterCutoff,
                rolloff: -24
            });

            this.distortion = new Tone.Distortion({
                distortion: this.audioParams.distortion / 100,
                oversample: '4x'
            });

            this.synth.chain(this.filter, this.distortion, Tone.Destination);

            // Appliquer le volume courant (en %)
            Tone.Destination.volume.value = Tone.gainToDb(this.audioParams.volume / 100);

            this.audioInitialized = true;
        }

        this.isAudioStarted = true;
        this.updateStatus('audio-status', '🔊 Actif', 'success');
        document.getElementById('start-audio').disabled = true;
        document.getElementById('stop-audio').disabled = false;

        // Test audio simple
        this.testAudio();
    }

    async testAudio() {
        // Jouer une note de test pour vérifier que l'audio fonctionne
        if (typeof Tone === 'undefined') return;
        await Tone.start();
        const testSynth = new Tone.Synth().toDestination();
        testSynth.triggerAttackRelease("C4", "8n");
        console.log('Test audio effectué - vous devriez entendre un son');
    }

    stopAudio() {
        if (this.isAudioStarted) {
            this.isAudioStarted = false;
            this.synth.triggerRelease();
            this.currentNote = false;
            this.updateStatus('audio-status', '🔇 Arrêté', 'ready');
            document.getElementById('start-audio').disabled = false;
            document.getElementById('stop-audio').disabled = true;
        }
    }

    updateFingerStatus() {
        const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'];
        const fingerLabels = ['thumb', 'index', 'middle', 'ring', 'pinky'];

        fingerNames.forEach((finger, index) => {
            const element = document.getElementById(`${fingerLabels[index]}-status`);
            if (element) {
                element.textContent = this.fingerStates[finger] ? '✅' : '—';
                element.className = `finger-indicator ${this.fingerStates[finger] ? 'extended' : 'retracted'}`;
            }
        });
    }

    updateParameterDisplay() {
        document.getElementById('filter-value').textContent = `${this.audioParams.filterCutoff} Hz`;
        document.getElementById('distortion-value').textContent = `${this.audioParams.distortion}%`;
        document.getElementById('volume-value').textContent = `${this.audioParams.volume}%`;

        // Mettre à jour les sliders
        document.getElementById('filter-cutoff').value = this.audioParams.filterCutoff;
        document.getElementById('distortion').value = this.audioParams.distortion;
        document.getElementById('volume').value = this.audioParams.volume;
    }

    updateStatus(elementId, text, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
            element.className = `status-value ${type}`;
        }
    }

    // Gestion des presets
    savePreset() {
        const name = document.getElementById('preset-name').value.trim();
        if (!name) {
            alert('Veuillez entrer un nom pour le preset');
            return;
        }

        const preset = {
            name: name,
            hand1Role: this.hand1Role,
            hand2Role: this.hand2Role,
            audioParams: { ...this.audioParams }
        };

        this.presets[name] = preset;
        this.savePresets();
        this.updatePresetList();
        document.getElementById('preset-name').value = '';

        console.log(`Preset "${name}" sauvegardé`);
    }

    loadPreset() {
        const presetName = document.getElementById('preset-select').value;
        if (!presetName || !this.presets[presetName]) {
            alert('Veuillez sélectionner un preset valide');
            return;
        }

        const preset = this.presets[presetName];

        // Appliquer les paramètres
        this.hand1Role = preset.hand1Role;
        this.hand2Role = preset.hand2Role;
        this.audioParams = { ...preset.audioParams };

        // Mettre à jour l'interface
        document.getElementById('hand1-role').value = this.hand1Role;
        document.getElementById('hand2-role').value = this.hand2Role;

        // Appliquer les paramètres audio
        this.filter.frequency.value = this.audioParams.filterCutoff;
        this.distortion.distortion = this.audioParams.distortion / 100;
        Tone.Destination.volume.value = Tone.gainToDb(this.audioParams.volume / 100);

        this.updateParameterDisplay();

        console.log(`Preset "${presetName}" chargé`);
    }

    deletePreset() {
        const presetName = document.getElementById('preset-select').value;
        if (!presetName || !this.presets[presetName]) {
            alert('Veuillez sélectionner un preset à supprimer');
            return;
        }

        if (confirm(`Êtes-vous sûr de vouloir supprimer le preset "${presetName}" ?`)) {
            delete this.presets[presetName];
            this.savePresets();
            this.updatePresetList();
            console.log(`Preset "${presetName}" supprimé`);
        }
    }

    updatePresetList() {
        const select = document.getElementById('preset-select');
        select.innerHTML = '<option value="">Sélectionner un preset...</option>';

        Object.keys(this.presets).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    }

    loadPresets() {
        const saved = localStorage.getItem('gestureMusicPresets');
        return saved ? JSON.parse(saved) : {};
    }

    savePresets() {
        localStorage.setItem('gestureMusicPresets', JSON.stringify(this.presets));
    }

    // Visualisation audio
    startAudioVisualization() {
        this.audioCanvas = document.getElementById('audio-canvas');
        this.audioCtx = this.audioCanvas.getContext('2d');

        const draw = () => {
            if (!this.isAudioStarted) {
                requestAnimationFrame(draw);
                return;
            }

            this.audioCtx.fillStyle = '#1f2937';
            this.audioCtx.fillRect(0, 0, this.audioCanvas.width, this.audioCanvas.height);

            // Dessiner une visualisation simple
            this.audioCtx.strokeStyle = '#10b981';
            this.audioCtx.lineWidth = 2;
            this.audioCtx.beginPath();

            const centerY = this.audioCanvas.height / 2;
            const amplitude = 50;

            for (let x = 0; x < this.audioCanvas.width; x++) {
                const y = centerY + Math.sin((x * 0.02) + Date.now() * 0.005) * amplitude;

                if (x === 0) {
                    this.audioCtx.moveTo(x, y);
                } else {
                    this.audioCtx.lineTo(x, y);
                }
            }

            this.audioCtx.stroke();

            requestAnimationFrame(draw);
        };

        draw();
    }

    // PWA Installation
    setupPWAInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('install-prompt').style.display = 'block';
        });

        document.getElementById('install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`PWA installation: ${outcome}`);
                deferredPrompt = null;
                document.getElementById('install-prompt').style.display = 'none';
            }
        });
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new GestureMusicApp();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service Worker enregistré avec succès:', registration);
            })
            .catch((error) => {
                console.log('Échec de l\'enregistrement du Service Worker:', error);
            });
    });
}
