# 📧 Configuration EmailJS - Instructions

## Étape 1 : Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Cliquez sur **"Sign Up"** (gratuit - 200 emails/mois)
3. Vérifiez votre email

## Étape 2 : Configurer votre Service Email

1. Dans le dashboard EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez **Gmail** (ou autre fournisseur)
4. Connectez votre compte Gmail : `loickoehly@gmail.com`
5. Notez le **Service ID** (ex: `service_xyz123`)

## Étape 3 : Créer un Template d'Email

1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Utilisez ce template :

```
Nouveau message depuis votre portfolio !

De : {{from_name}}
Email : {{from_email}}
Sujet : {{subject}}

Message :
{{message}}
```

4. Notez le **Template ID** (ex: `template_abc456`)

## Étape 4 : Obtenir votre Public Key

1. Allez dans **"Account"** → **"General"**
2. Copiez votre **Public Key** (ex: `AbCdEf123456`)

## Étape 5 : Configurer le Portfolio

Dans le fichier `index.html`, ligne 20 et 667, remplacez :

```javascript
// Ligne 20 :
publicKey: "YOUR_PUBLIC_KEY", // Remplacez par votre Public Key

// Ligne 667 :
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
// Remplacez par vos IDs réels
```

### Exemple complet :
```javascript
// Ligne 20 :
publicKey: "AbCdEf123456",

// Ligne 667 :
emailjs.sendForm('service_xyz123', 'template_abc456', form)
```

## ✅ Test

1. Ouvrez votre portfolio
2. Remplissez le formulaire de contact
3. Cliquez sur "Envoyer le message"
4. Vous devriez recevoir l'email dans votre boîte Gmail !

## 🎯 Avantages EmailJS

- ✅ **Gratuit** : 200 emails/mois
- ✅ **Aucun backend** nécessaire
- ✅ **Sécurisé** : Pas d'exposition des credentials
- ✅ **Fiable** : Utilisé par des milliers de sites
- ✅ **Support** : Documentation complète

## 🔒 Sécurité

- Votre email n'est jamais visible dans le code
- Les clés publiques sont sûres (pas de danger si elles sont exposées)
- Protection anti-spam intégrée

## 📱 Notifications

Activez les notifications push sur votre téléphone pour recevoir les messages instantanément !

---

**Besoin d'aide ?** Consultez la documentation : https://www.emailjs.com/docs/
