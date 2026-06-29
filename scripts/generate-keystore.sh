#!/bin/bash
# Generiert den Android Release Keystore für Wortwende
# Benötigt: keytool (JDK)

KEYSTORE="android/app/wortwende.keystore"
ALIAS="wortwende"
VALIDITY=10000

if [ ! -f "$KEYSTORE" ]; then
  echo "🔑 Generiere Keystore: $KEYSTORE"
  keytool -genkey -v \
    -keystore "$KEYSTORE" \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity $VALIDITY \
    -storepass "$ANDROID_KEYSTORE_PASSWORD" \
    -keypass "$ANDROID_KEYSTORE_PASSWORD" \
    -dname "CN=Tolga Guensal, OU=Wortwende, O=GuenLab, L=Berlin, ST=Berlin, C=DE"
  echo "✅ Keystore erstellt"
else
  echo "⚠️  Keystore existiert bereits: $KEYSTORE"
fi

# Keystore für CI base64-enkodieren
if [ -n "$CI" ]; then
  echo "📦 Base64 für GitHub Secrets:"
  base64 -w0 "$KEYSTORE"
  echo ""
fi
