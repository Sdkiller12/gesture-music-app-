# 🚀 Guide de Démarrage Rapide - Gesture Music App

## 📋 Étapes pour Démarrer en 5 Minutes

### 1️⃣ Préparer les Icônes PWA

**Important** : Avant de lancer l'application, créez les icônes manquantes :

```bash
# Ouvrir le générateur d'icônes dans votre navigateur
# Ouvrir icons/generate-icons.html
# Télécharger les deux icônes générées
# Les placer dans le dossier icons/
```

Ou utilisez des icônes temporaires en renommant `icon.svg` :
- Créer deux copies : `icon-192.png` et `icon-512.png`

### 2️⃣ Lancer l'Application

**Option A - Double-clic** (Simple mais limité)
```
Ouvrir index.html directement dans votre navigateur
```

**Option B - Serveur Local** (Recommandé)
```bash
# Avec Python (si installé)
python -m http.server 8000
# Puis ouvrir : http://localhost:8000

# Avec Node.js (si installé)
npx serve .
# Ou
npx live-server .

# Avec VS Code + Extension Live Server
# Clic droit sur index.html → "Open with Live Server"
```

### 3️⃣ Autoriser la Caméra

1. Le navigateur vous demandera l'accès à la caméra
2. Cliquer sur **"Autoriser"**
3. Attendre que la caméra se lance (status : ✅ Actif)

### 4️⃣ Démarrer la Musique

1. Cliquer sur **"🎵 Démarrer Audio"**
2. Placer vos mains devant la caméra
3. **Étendre l'index** pour jouer une note
4. Bouger la main verticalement pour changer la hauteur de la note

### 5️⃣ Expérimenter

**Essayer les contrôles :**
- Main gauche : Contrôle les notes (par défaut)
- Main droite : Contrôle les effets (filtre + distorsion)
- Bouger horizontalement : Modifie le filtre
- Bouger verticalement : Modifie la distorsion

**Sauvegarder vos réglages :**
1. Ajuster les paramètres à votre goût
2. Entrer un nom dans "Nom du preset"
3. Cliquer sur "💾 Sauvegarder"

## 🎮 Raccourcis Gestes

| Geste | Action |
|-------|--------|
| Index étendu + Main haute | Note aiguë |
| Index étendu + Main basse | Note grave |
| Main gauche ↔️ | Change le volume |
| Main droite ↔️ | Change le filtre |
| Main droite ↕️ | Change la distorsion |

## ❓ Problèmes Courants

### La caméra ne démarre pas
- Vérifier que la caméra n'est pas utilisée ailleurs
- Recharger la page (F5)
- Essayer un autre navigateur

### Pas de son
- Cliquer sur "Démarrer Audio" en premier
- Vérifier le volume du navigateur
- Vérifier le volume système

### Gestes non détectés
- Améliorer l'éclairage
- Se rapprocher de la caméra
- Éviter les arrière-plans complexes

## 📱 Installation PWA

1. Rechercher l'icône "Installer" dans la barre d'adresse
2. Ou cliquer sur "📱 Installer l'App" dans le footer
3. Suivre les instructions
4. L'app apparaîtra dans vos applications

## 🎵 Bon Amusement !

Expérimentez avec différentes configurations et créez votre propre expérience musicale gestuelle !

---

**Besoin d'aide ?** Consultez le [README.md](README.md) complet pour plus de détails.
