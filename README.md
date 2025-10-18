# 🎵 Gesture Music App

Une application web moderne qui permet de contrôler la musique avec des gestes de la main détectés par la webcam, utilisant l'IA et la synthèse audio en temps réel.

## ✨ Fonctionnalités

### 🎯 Détection des Gestes
- **MediaPipe Hands** pour la détection précise des positions des doigts
- **Calcul d'angles** entre les segments MCP–PIP–DIP de chaque doigt
- **Détection d'extension** : un doigt est considéré comme étendu si l'angle > 160°
- **Contrôle conditionnel** : les notes ne se jouent que si l'index est étendu

### 🎼 Contrôles Musicaux
- **Tone.js** pour la génération de sons MIDI synthétisés
- **Main #1** → contrôle des notes MIDI et du rythme
- **Main #2** → contrôle des effets audio (filtre, distorsion)
- **Mouvements horizontaux** (axe X) → modification de la fréquence du filtre
- **Mouvements verticaux** (axe Y) → modification de l'intensité de la distorsion

### 🎨 Interface Moderne
- **Caméra en direct** avec visualisation des landmarks des doigts
- **Guide visuel** indiquant quels doigts sont étendus (✅ ou —)
- **Interface de contrôle** avec sélection du rôle de chaque main
- **Gestion des presets** pour sauvegarder, charger et supprimer des configurations
- **Design responsive** adapté aux mobiles et tablettes

### 📱 PWA (Progressive Web App)
- **Installation native** sur mobile et desktop
- **Mode hors ligne** grâce au service worker
- **Icônes personnalisées** pour l'installation
- **Manifest complet** avec métadonnées

## 🚀 Installation et Utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Webcam fonctionnelle
- Connexion internet (pour le chargement initial des bibliothèques)

### Installation
1. **Télécharger le projet**
   ```bash
   git clone [url-du-repo]
   cd gesture-music-app
   ```

2. **Ouvrir l'application**
   - Ouvrir `index.html` dans un navigateur web
   - Ou utiliser un serveur local (recommandé) :
   ```bash
   # Avec Python
   python -m http.server 8000
   
   # Avec Node.js
   npx serve .
   
   # Avec Live Server (VS Code)
   # Clic droit sur index.html → "Open with Live Server"
   ```

3. **Autoriser l'accès à la caméra**
   - Cliquer sur "Autoriser" quand le navigateur demande l'accès à la caméra

### Utilisation

#### 🎵 Démarrer l'Application
1. Cliquer sur **"🎵 Démarrer Audio"** pour activer la synthèse audio
2. Positionner vos mains devant la caméra
3. Étendre l'index pour jouer des notes

#### 🎛️ Configuration des Mains
- **Main 1 (Gauche)** : Choisir entre "Notes MIDI", "Effets Audio", ou "Volume"
- **Main 2 (Droite)** : Choisir entre "Notes MIDI", "Effets Audio", ou "Volume"

#### 🎚️ Contrôles Audio
- **Filtre Cutoff** : Modifier la fréquence de coupure du filtre (100Hz - 2000Hz)
- **Distorsion** : Ajuster l'intensité de la distorsion (0% - 100%)
- **Volume** : Contrôler le volume global (0% - 100%)

#### 💾 Gestion des Presets
1. **Sauvegarder** : Entrer un nom et cliquer sur "💾 Sauvegarder"
2. **Charger** : Sélectionner un preset et cliquer sur "📂 Charger"
3. **Supprimer** : Sélectionner un preset et cliquer sur "🗑️ Supprimer"

#### 📱 Installation PWA
1. Cliquer sur **"📱 Installer l'App"** (apparaît automatiquement)
2. Suivre les instructions du navigateur
3. L'application sera installée comme une app native

## 🛠️ Architecture Technique

### Technologies Utilisées
- **HTML5** : Structure et sémantique
- **CSS3** : Design moderne et responsive
- **JavaScript ES6+** : Logique de l'application
- **MediaPipe Hands** : Détection des gestes de main
- **Tone.js** : Synthèse audio et effets
- **Service Worker** : Cache et mode hors ligne
- **Web App Manifest** : Installation PWA

### Structure du Projet
```
gesture-music-app/
├── index.html              # Page principale
├── style.css               # Styles CSS
├── script.js               # Logique JavaScript
├── manifest.json           # Manifest PWA
├── service-worker.js       # Service Worker
├── icons/                  # Icônes PWA
│   ├── icon-192.png
│   ├── icon-512.png
│   └── create-icons.js     # Générateur d'icônes
├── create_icons.py         # Script Python pour icônes
└── README.md              # Documentation
```

### Classes et Fonctionnalités Principales

#### `GestureMusicApp`
Classe principale gérant :
- Initialisation de la caméra et MediaPipe
- Configuration de l'audio avec Tone.js
- Détection et traitement des gestes
- Contrôle des paramètres audio
- Gestion des presets
- Interface utilisateur

#### Méthodes Clés
- `calculateFingerAngles()` : Calcul des angles des doigts
- `controlAudio()` : Contrôle audio basé sur les gestes
- `updateFingerStatus()` : Mise à jour de l'interface
- `savePreset()` / `loadPreset()` : Gestion des presets

## 🎮 Guide des Gestes

### Doigts Détectés
- **Pouce** : Contrôle optionnel
- **Index** : **OBLIGATOIRE** pour jouer des notes
- **Majeur** : Contrôle optionnel
- **Annulaire** : Contrôle optionnel
- **Auriculaire** : Contrôle optionnel

### Rôles des Mains

#### 🎵 Notes MIDI
- **Position Y** : Contrôle la fréquence (220Hz - 1100Hz)
- **Position X** : Contrôle la vélocité (volume de la note)
- **Index étendu** : Joue la note
- **Index replié** : Arrête la note

#### 🎛️ Effets Audio
- **Position X** : Contrôle le filtre cutoff (100Hz - 2000Hz)
- **Position Y** : Contrôle la distorsion (0% - 100%)

#### 🔊 Volume
- **Position Y** : Contrôle le volume global (0% - 100%)

## 🔧 Configuration Avancée

### Paramètres MediaPipe
```javascript
this.hands.setOptions({
    maxNumHands: 2,           // Nombre maximum de mains
    modelComplexity: 1,       // Complexité du modèle (0-1)
    minDetectionConfidence: 0.5,  // Confiance minimale de détection
    minTrackingConfidence: 0.5    // Confiance minimale de suivi
});
```

### Paramètres Audio
```javascript
// Synthétiseur
this.synth = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.3,
        release: 0.8
    }
});

// Filtre
this.filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 1000,
    rolloff: -24
});

// Distorsion
this.distortion = new Tone.Distortion({
    distortion: 0,
    oversample: '4x'
});
```

## 🐛 Dépannage

### Problèmes Courants

#### La caméra ne se lance pas
- Vérifier que la caméra n'est pas utilisée par une autre application
- Autoriser l'accès à la caméra dans les paramètres du navigateur
- Essayer de recharger la page

#### L'audio ne fonctionne pas
- Cliquer sur "Démarrer Audio" pour activer Tone.js
- Vérifier que le volume du navigateur n'est pas coupé
- Certains navigateurs nécessitent une interaction utilisateur avant de jouer l'audio

#### Les gestes ne sont pas détectés
- S'assurer que les mains sont bien visibles dans le cadre
- Améliorer l'éclairage de la pièce
- Éviter les arrière-plans trop chargés

#### L'application ne s'installe pas
- Vérifier que le navigateur supporte les PWA
- S'assurer que le manifest.json est accessible
- Essayer en mode HTTPS (requis pour certaines fonctionnalités PWA)

### Performance
- Fermer les autres onglets utilisant la caméra
- Utiliser un navigateur récent pour de meilleures performances
- Réduire la complexité du modèle MediaPipe si nécessaire

## 🤝 Contribution

### Développement
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

### Améliorations Possibles
- [ ] Visualisation audio plus avancée (oscilloscope, spectrogramme)
- [ ] Mode enregistrement et rejeu des gestes
- [ ] Support de plus d'instruments MIDI
- [ ] Effets audio supplémentaires (réverbération, chorus, etc.)
- [ ] Mode multi-utilisateurs
- [ ] Intégration avec des contrôleurs MIDI externes

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **MediaPipe** pour la détection des gestes de main
- **Tone.js** pour la synthèse audio
- **Mozilla** pour les exemples PWA
- **Communauté open source** pour l'inspiration

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation des bibliothèques utilisées
- Vérifier les logs de la console du navigateur

---

**Gesture Music App** - Contrôlez la musique avec vos gestes ! 🎵✨
