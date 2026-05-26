# 📋 Test React — Formulaire d'inscription avec tests automatisés

> **Auteur :** Julio Tepixtle

Ce projet React a pour objectif de **générer et structurer des tests automatisés** à partir d'un formulaire d'inscription. Il illustre deux niveaux de tests : les **tests unitaires** sur les fonctions de validation métier, et les **tests d'intégration** sur le composant formulaire complet.

---

## 📁 Structure du projet

```
src/
├── utils/
│   ├── module.js           # Fonctions de validation métier
│   └── module.test.js      # Tests unitaires
├── RegistrationForm.js     # Composant formulaire React
└── RegistrationForm.test.js # Tests d'intégration
```

---

## 🔧 `utils/module.js` — Fonctions de validation

Ce fichier contient les **fonctions utilitaires de base** utilisées pour valider les données du formulaire. Chaque fonction est pure, indépendante et testable de manière isolée.

| Fonction | Description |
|---|---|
| `calculateAge(p)` | Calcule l'âge en années à partir d'un objet `{ birth: Date }` |
| `isAdult(p)` | Retourne `true` si la personne a au moins 18 ans |
| `isValidPostalCode(code)` | Valide un code postal français (exactement 5 chiffres) |
| `isValidName(name)` | Valide un nom/prénom/ville (lettres, accents, tirets, apostrophes) |
| `isValidEmail(email)` | Valide le format d'une adresse e-mail |

---

## 🧪 `utils/module.test.js` — Tests unitaires

Les tests unitaires couvrent **chaque cas possible** pour chacune des fonctions de validation. Ils sont organisés par `describe` block.

### `calculateAge`

| Test | Description |
|---|---|
| ✅ Date de naissance connue | Vérifie le calcul correct de l'âge pour une date réelle |
| ❌ Aucun argument | Lance `"missing param p"` |
| ❌ `birth` est une chaîne vide | Lance `"missing birth date"` |
| ❌ `null` passé en argument | Lance `"missing param p"` |

### `isAdult`

| Test | Description |
|---|---|
| ✅ Né en 1990 | Retourne `true` (majeur) |
| ❌ Né il y a 10 ans | Retourne `false` (mineur) |
| ❌ Né il y a 17 ans | Retourne `false` (mineur) |
| ✅ Né il y a exactement 18 ans | Retourne `true` (exactement majeur) |
| ❌ Aucun argument | Lance `"missing param p"` |
| ❌ Objet sans propriété `birth` | Lance `"missing birth date"` |
| ❌ Date invalide (`new Date('invalid')`) | Lance `"missing birth date"` |

### `isValidPostalCode`

| Test | Description |
|---|---|
| ✅ Codes standards (`75001`, `06000`, `13100`) | Retourne `true` |
| ❌ Moins de 5 chiffres | Retourne `false` |
| ❌ Plus de 5 chiffres | Retourne `false` |
| ❌ Contient des lettres | Retourne `false` |
| ❌ Chaîne vide | Retourne `false` |
| ❌ Valeur non-string (nombre) | Retourne `false` |
| ❌ Contient des espaces | Retourne `false` |

### `isValidName`

| Test | Description |
|---|---|
| ✅ Nom simple (`Dupont`) | Retourne `true` |
| ✅ Caractères accentués (`Éléonore`, `Noël`…) | Retourne `true` |
| ✅ Nom composé avec tiret (`Marie-Claire`) | Retourne `true` |
| ✅ Nom avec apostrophe (`D'Artagnan`) | Retourne `true` |
| ✅ Ville avec espace ou tiret (`Le Havre`, `Aix-en-Provence`) | Retourne `true` |
| ✅ Ligatures `ç` et `œ` (`François`, `Cœur`) | Retourne `true` |
| ❌ Contient un chiffre (`Dupont1`) | Retourne `false` |
| ❌ Contient un caractère spécial (`!`, `@`…) | Retourne `false` |
| ❌ Chaîne vide | Retourne `false` |
| ❌ Chaîne composée uniquement d'espaces | Retourne `false` |

### `isValidEmail`

| Test | Description |
|---|---|
| ✅ E-mails standards (`jean.dupont@gmail.com`) | Retourne `true` |
| ✅ E-mail avec sous-domaine | Retourne `true` |
| ✅ E-mail avec alias `+` (`user+tag@gmail.com`) | Retourne `true` |
| ❌ Sans `@` | Retourne `false` |
| ❌ Sans extension de domaine | Retourne `false` |
| ❌ Contient des espaces | Retourne `false` |
| ❌ Chaîne vide | Retourne `false` |
| ❌ Valeur non-string (`null`) | Retourne `false` |

---

## 🧩 `RegistrationForm.js` — Composant formulaire

`RegistrationForm` est un composant React qui affiche un **formulaire d'inscription** avec les champs suivants : Nom, Prénom, Adresse e-mail, Date de naissance, Ville et Code postal.

Il utilise les fonctions de `utils/module.js` pour valider les données en temps réel et présente les comportements suivants :

- **Validation à la volée** : les erreurs s'affichent uniquement après qu'un champ a été touché (`onBlur`).
- **Bouton désactivé** : le bouton *S'inscrire* reste `disabled` tant que tous les champs ne sont pas valides.
- **Toast de succès** : un message de confirmation s'affiche 4 secondes après une soumission réussie.
- **Réinitialisation** : le formulaire est vidé après une soumission valide.
- **Persistance** : les inscriptions sont sauvegardées dans le `localStorage` (clé `registrations`).

---

## 🔬 `RegistrationForm.test.js` — Tests d'intégration

Ces tests utilisent **React Testing Library** (`render`, `fireEvent`, `screen`) pour simuler les interactions utilisateur sur le composant `RegistrationForm`. Ils réutilisent les mêmes règles de validation que `utils/module.js` et vérifient le comportement global du formulaire.

### État du bouton de soumission

| Test | Description |
|---|---|
| ❌ Formulaire vide | Le bouton *S'inscrire* est `disabled` |
| ✅ Tous les champs valides | Le bouton est activé |
| ❌ Seulement certains champs remplis | Le bouton reste `disabled` |
| ❌ Un champ valide est effacé | Le bouton redevient `disabled` |

### Affichage des erreurs (après `blur`)

| Test | Description |
|---|---|
| ❌ `nom` contient un chiffre | Affiche `"Nom invalide…"` avec la classe `.form-error` |
| ❌ `email` est mal formé | Affiche `"e-mail invalide…"` avec la classe `.form-error` |
| ❌ `codePostal` n'a pas 5 chiffres | Affiche `"Code postal invalide…"` avec la classe `.form-error` |
| ❌ Personne de moins de 18 ans | Affiche `"…18 ans…"` avec la classe `.form-error` |
| ❌ `prenom` contient un caractère spécial | Affiche `"Prénom invalide…"` avec la classe `.form-error` |
| ❌ `ville` contient des chiffres | Affiche `"Ville invalide…"` avec la classe `.form-error` |
| ✅ Aucun champ touché | Aucun message d'erreur ne s'affiche |

### Comportement à la soumission

| Test | Description |
|---|---|
| ✅ Soumission valide | Affiche un toast de succès avec le rôle `alert` et la classe `.toast-success` |
| ✅ Soumission valide | Tous les champs sont vidés après soumission |
| ✅ Soumission valide | Le bouton redevient `disabled` après soumission |
| ✅ Soumission valide | L'entrée est sauvegardée dans `localStorage` avec les bonnes valeurs |
| ✅ Soumissions multiples | Chaque inscription s'accumule dans `localStorage` |
| ❌ Formulaire invalide | Rien n'est sauvegardé dans `localStorage` |
| ❌ Soumission forcée invalide (via `fireEvent.submit`) | Aucune entrée créée, aucun toast affiché |

### Gestion du timer du toast

| Test | Description |
|---|---|
| ⏱️ `useEffect` cleanup | Le toast disparaît automatiquement après 4 secondes (`jest.useFakeTimers`) |

---

## 🚀 Lancer les tests

```bash
npm test
```

> Les tests sont exécutés avec **Jest** et **React Testing Library** (configurés par défaut avec Create React App).
