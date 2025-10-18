# 🔧 Guide de Dépannage Audio - Gesture Music App

## 🎵 Problème : Pas de son quand je bouge mes doigts

### ✅ Étapes de Diagnostic

#### 1️⃣ Vérifier l'État de l'Application
- **Caméra** : Doit afficher "✅ Actif"
- **Audio** : Doit afficher "🔊 Actif" (après avoir cliqué sur "Démarrer Audio")
- **Note** : Affiche "🎵 XXXHz" quand une note est jouée

#### 2️⃣ Test Audio de Base
1. Cliquer sur **"🔊 Test Audio"**
2. Vous devriez entendre un son de test
3. Si pas de son → Problème de configuration audio

#### 3️⃣ Vérifier les Gestes
1. **Index étendu** : Le doigt doit être complètement droit (angle > 160°)
2. **Position de la main** : Dans le cadre de la caméra
3. **Éclairage** : Suffisant pour détecter les doigts

### 🔍 Solutions par Problème

#### ❌ Pas de son du tout

**Causes possibles :**
- Audio non démarré
- Volume coupé
- Navigateur bloqué
- Tone.js non chargé

**Solutions :**
1. **Cliquer sur "🎵 Démarrer Audio"** (obligatoire)
2. **Vérifier le volume** du navigateur et du système
3. **Recharger la page** (F5)
4. **Ouvrir la console** (F12) et vérifier les erreurs
5. **Essayer un autre navigateur** (Chrome recommandé)

#### ❌ Test audio ne fonctionne pas

**Solutions :**
1. **Autoriser l'audio** quand le navigateur le demande
2. **Cliquer quelque part** sur la page avant le test
3. **Vérifier les paramètres** de son du navigateur
4. **Désactiver les bloqueurs** de publicité
5. **Utiliser HTTPS** ou localhost (pas file://)

#### ❌ Gestes détectés mais pas de son

**Causes possibles :**
- Index pas assez étendu
- Main pas dans le bon rôle
- Problème de calcul d'angle

**Solutions :**
1. **Étendre complètement l'index** (doigt droit)
2. **Vérifier le rôle de la main** (doit être "Notes MIDI")
3. **Regarder l'indicateur "Note"** dans le header
4. **Bouger la main verticalement** pour changer la fréquence

#### ❌ Son saccadé ou coupé

**Solutions :**
1. **Améliorer l'éclairage** de la pièce
2. **Se rapprocher** de la caméra
3. **Éviter les mouvements** trop rapides
4. **Fermer d'autres onglets** utilisant la caméra

### 🎮 Guide des Gestes Corrects

#### ✅ Pour Jouer une Note
1. **Main gauche** : Rôle "Notes MIDI" (par défaut)
2. **Index complètement étendu** (doigt droit)
3. **Main dans le cadre** de la caméra
4. **Bouger verticalement** pour changer la hauteur

#### ✅ Pour Contrôler les Effets
1. **Main droite** : Rôle "Effets Audio" (par défaut)
2. **Bouger horizontalement** : Change le filtre
3. **Bouger verticalement** : Change la distorsion

### 🔧 Configuration Avancée

#### Paramètres du Navigateur
```javascript
// Dans la console (F12)
// Vérifier que Tone.js est chargé
console.log(typeof Tone); // Doit afficher "object"

// Vérifier l'état de l'audio
console.log(Tone.context.state); // Doit être "running"
```

#### Debug des Gestes
```javascript
// Activer les logs détaillés
// Dans la console, taper :
window.debugGestures = true;
```

### 📱 Problèmes Spécifiques par Navigateur

#### Chrome
- ✅ **Recommandé** pour les meilleures performances
- ⚠️ Peut demander l'autorisation audio plusieurs fois

#### Firefox
- ✅ Bon support de Tone.js
- ⚠️ Peut avoir des problèmes avec MediaPipe

#### Safari
- ⚠️ Support limité de certaines APIs
- ⚠️ Peut nécessiter HTTPS

#### Edge
- ✅ Bon support général
- ⚠️ Peut avoir des problèmes de performance

### 🚨 Erreurs Courantes

#### "Tone is not defined"
- **Cause** : Tone.js non chargé
- **Solution** : Recharger la page, vérifier la connexion internet

#### "Camera not accessible"
- **Cause** : Caméra utilisée ailleurs ou permissions refusées
- **Solution** : Fermer autres applications, autoriser l'accès

#### "Audio context was not allowed to start"
- **Cause** : Navigateur bloque l'audio
- **Solution** : Cliquer sur la page, autoriser l'audio

#### "Hands not detected"
- **Cause** : Éclairage insuffisant ou main hors cadre
- **Solution** : Améliorer l'éclairage, repositionner la main

### 📞 Support Technique

Si le problème persiste :

1. **Ouvrir la console** (F12) et copier les erreurs
2. **Tester sur un autre navigateur**
3. **Vérifier la configuration** système
4. **Consulter les logs** de l'application

### 🎯 Test de Fonctionnement Complet

1. ✅ Ouvrir l'application
2. ✅ Autoriser la caméra
3. ✅ Cliquer "Démarrer Audio"
4. ✅ Cliquer "Test Audio" → Entendre un son
5. ✅ Étendre l'index → Voir "🎵 XXXHz" dans le header
6. ✅ Bouger la main → Entendre la note changer

Si toutes ces étapes fonctionnent, l'application est opérationnelle ! 🎵

---

**Note** : Ce guide couvre les problèmes les plus courants. Pour des problèmes spécifiques, consultez la documentation de Tone.js et MediaPipe.
