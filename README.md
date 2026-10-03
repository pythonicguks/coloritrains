# coloritrains

## Colori'Trains

Jeu de trains pour la grande section de maternelle (5 ans), pensé pour le téléphone.
Ouvrir `index.html` dans un navigateur. Rien à installer.

- **But** : glisser des rails depuis le bas de l'écran pour emmener chaque train à sa gare, puis appuyer sur **Partez !**
- **Gestes** : glisser un rail sur une case pour le poser ; toucher un rail posé pour le faire tourner ; le glisser hors du plateau pour l'enlever. 🧹 efface tout.
- **10 niveaux** :
  1-3 couleurs · 4-6 formes (le niveau 5 piège avec des couleurs trompeuses, le 6 ajoute le croisement) · 7-8 lettres (majuscule puis majuscule → minuscule) · 9 chiffres · 10 chiffre → nombre de points.
- **Voix** : la consigne est lue à voix haute (🔊 pour la réécouter). Toucher un train ou une gare dit son nom.
- **Aide** 💡 : pose le rail suivant de la solution.
- 1 à 3 étoiles selon le nombre d'essais ; réussir un niveau ouvre le suivant. Progression gardée sur l'appareil. Lien « Parents » en bas du menu pour tout ouvrir.

Vérifier que les 10 niveaux ont une solution : `node tests/levels.test.mjs`
