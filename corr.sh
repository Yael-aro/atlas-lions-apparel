cd ~/Desktop/atlas-lions-apparel

# Corriger TOUS les fichiers TypeScript
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e 's|jerseyWhiteImage\.jpg|jerseywhiteimage.jpg|g' \
  -e 's|backWhiteImage\.jpg|backwhiteimage.jpg|g' \
  -e 's|Short\.jpg|short.jpg|g' \
  -e 's|Minature\.jpg|minature.jpg|g' \
  -e 's|MinatureWhite\.jpg|minaturewhite.jpg|g' \
  -e 's|minatureWhite\.jpg|minaturewhite.jpg|g' \
  {} +

echo "✅ Imports corrigés"

# Vérifier qu'il n'y a plus d'imports incorrects
echo ""
echo "🔍 Vérification..."
grep -r "jerseyWhiteImage.jpg\|backWhiteImage.jpg\|Short.jpg\|Minature.jpg\|MinatureWhite.jpg\|minatureWhite.jpg" src/ && echo "❌ Il reste des imports incorrects" || echo "✅ Tous les imports sont corrects"

# Commit et push
echo ""
echo "📦 Commit et push..."
git add .
git commit -m "Fix: normalize all image imports to lowercase filenames"
git push origin main

# Redéployer
echo ""
echo "🚀 Redéploiement..."
vercel --prod
