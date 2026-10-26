$ErrorActionPreference = "Stop"

$JDK_DIR = "C:\Program Files\Android\Android Studio\jbr"
$SDK_DIR = "C:\Users\utsaw\AppData\Local\Android\Sdk"
$BUILD_TOOLS = "$SDK_DIR\build-tools\36.1.0"
$ANDROID_JAR = "$SDK_DIR\platforms\android-36.1\android.jar"

$env:JAVA_HOME = $JDK_DIR
$env:PATH = "$JDK_DIR\bin;$BUILD_TOOLS;$env:PATH"

$ROOT_DIR = "e:\kaam wale.com"
$BUILD_DIR = "$ROOT_DIR\android-build"
$BIN_DIR = "$BUILD_DIR\bin"
$OBJ_DIR = "$BUILD_DIR\obj"
$SRC_DIR = "$BUILD_DIR\src"
$RES_DIR = "$BUILD_DIR\res"
$MANIFEST = "$BUILD_DIR\AndroidManifest.xml"
$KEYSTORE = "$BUILD_DIR\kaamwale.keystore"
$FINAL_APK = "$ROOT_DIR\KaamWale.apk"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "🔨 Building KaamWale Standalone Android APK" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Ensure output directories exist
Remove-Item -Path $BIN_DIR -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path $OBJ_DIR -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $BIN_DIR -Force | Out-Null
New-Item -ItemType Directory -Path $OBJ_DIR -Force | Out-Null

# 1. Compile Resources with aapt2
Write-Host "[1/6] Compiling Android Resources..." -ForegroundColor Yellow
& "$BUILD_TOOLS\aapt2.exe" compile --dir "$RES_DIR" -o "$BIN_DIR\res.zip"
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed" }

# 2. Link Resources with aapt2 (generates R.java and initial package)
Write-Host "[2/6] Linking Resources & Generating R.java..." -ForegroundColor Yellow
& "$BUILD_TOOLS\aapt2.exe" link -I "$ANDROID_JAR" `
    --manifest "$MANIFEST" `
    -o "$BIN_DIR\unaligned.apk" `
    -R "$BIN_DIR\res.zip" `
    --java "$SRC_DIR" `
    --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed" }

# 3. Compile Java Source Code
Write-Host "[3/6] Compiling Java Source Files..." -ForegroundColor Yellow
$javaFiles = Get-ChildItem -Path "$SRC_DIR" -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
& "$JDK_DIR\bin\javac.exe" -source 8 -target 8 `
    -cp "$ANDROID_JAR" `
    -d "$OBJ_DIR" `
    $javaFiles
if ($LASTEXITCODE -ne 0) { throw "javac compilation failed" }

# 4. Pack classes into a temporary jar, then convert to DEX with d8
Write-Host "[4/6] Converting Java Bytecode to Dalvik DEX (classes.dex)..." -ForegroundColor Yellow
Push-Location "$OBJ_DIR"
& "$JDK_DIR\bin\jar.exe" cf "$BIN_DIR\app.jar" .
Pop-Location
if ($LASTEXITCODE -ne 0) { throw "jar creation failed" }

& cmd.exe /c "set JAVA_HOME=$JDK_DIR&& set PATH=$JDK_DIR\bin;%PATH%&& `"$BUILD_TOOLS\d8.bat`" --output `"$BIN_DIR`" --min-api 21 --lib `"$ANDROID_JAR`" `"$BIN_DIR\app.jar`""
if ($LASTEXITCODE -ne 0) { throw "d8 dexing failed" }

# 5. Add classes.dex into unaligned.apk
Write-Host "[5/6] Packaging classes.dex into APK..." -ForegroundColor Yellow
Push-Location $BIN_DIR
& "$JDK_DIR\bin\jar.exe" uf "unaligned.apk" "classes.dex"
if ($LASTEXITCODE -ne 0) { Pop-Location; throw "jar packaging failed" }
Pop-Location

# 6. Zipalign APK
Write-Host "[6/6] Aligning and Signing Release APK..." -ForegroundColor Yellow
& "$BUILD_TOOLS\zipalign.exe" -p -f -v 4 "$BIN_DIR\unaligned.apk" "$BIN_DIR\aligned.apk"
if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }

# Generate keystore if not exists
if (!(Test-Path $KEYSTORE)) {
    Write-Host "Creating release keystore..." -ForegroundColor Cyan
    & "$JDK_DIR\bin\keytool.exe" -genkey -v -keystore "$KEYSTORE" `
        -alias "kaamwale" -keyalg RSA -keysize 2048 -validity 10000 `
        -storepass "kaamwale2026" -keypass "kaamwale2026" `
        -dname "CN=KaamWale, OU=Production, O=KaamWale Inc, L=Delhi, ST=Delhi, C=IN"
    if ($LASTEXITCODE -ne 0) { throw "keytool failed" }
}

# Sign APK with apksigner
& cmd.exe /c "set JAVA_HOME=$JDK_DIR&& set PATH=$JDK_DIR\bin;%PATH%&& `"$BUILD_TOOLS\apksigner.bat`" sign --ks `"$KEYSTORE`" --ks-pass pass:kaamwale2026 --ks-key-alias kaamwale --key-pass pass:kaamwale2026 --out `"$FINAL_APK`" `"$BIN_DIR\aligned.apk`""
if ($LASTEXITCODE -ne 0) { throw "apksigner failed" }

# Verify signature
& cmd.exe /c "set JAVA_HOME=$JDK_DIR&& set PATH=$JDK_DIR\bin;%PATH%&& `"$BUILD_TOOLS\apksigner.bat`" verify --verbose `"$FINAL_APK`""

# Copy to public download directories
if (!(Test-Path "$ROOT_DIR\public\download")) {
    New-Item -ItemType Directory -Path "$ROOT_DIR\public\download" -Force | Out-Null
}
Copy-Item "$FINAL_APK" "$ROOT_DIR\public\download\KaamWale.apk" -Force
Copy-Item "$FINAL_APK" "$ROOT_DIR\public\download\kaamwale.apk" -Force

$apkSize = (Get-Item $FINAL_APK).Length
$apkSizeMB = [math]::Round($apkSize / 1MB, 2)

Write-Host "==============================================" -ForegroundColor Green
Write-Host "✅ APK BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "📱 Output APK: $FINAL_APK ($apkSizeMB MB)" -ForegroundColor Green
Write-Host "✨ Min SDK: 21 (Android 5.0+ Lollipop)" -ForegroundColor Green
Write-Host "🎯 Target SDK: 34 (Android 14+ / 15)" -ForegroundColor Green
Write-Host "🔒 Signed with v1, v2, v3, v4 signatures" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
