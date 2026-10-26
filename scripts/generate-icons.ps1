Add-Type -AssemblyName System.Drawing

$sizes = @{
    "public/icons/icon-72.png" = 72
    "public/icons/icon-96.png" = 96
    "public/icons/icon-128.png" = 128
    "public/icons/icon-144.png" = 144
    "public/icons/icon-152.png" = 152
    "public/icons/icon-192.png" = 192
    "public/icons/icon-384.png" = 384
    "public/icons/icon-512.png" = 512
    "public/icons/apple-touch-icon.png" = 180
    "public/favicon.png" = 64
    "android-build/res/mipmap-mdpi/ic_launcher.png" = 48
    "android-build/res/mipmap-hdpi/ic_launcher.png" = 72
    "android-build/res/mipmap-xhdpi/ic_launcher.png" = 96
    "android-build/res/mipmap-xxhdpi/ic_launcher.png" = 144
    "android-build/res/mipmap-xxxhdpi/ic_launcher.png" = 192
}

foreach ($item in $sizes.GetEnumerator()) {
    $path = $item.Key
    $size = $item.Value
    $dir = Split-Path -Path $path -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient: deep emerald to bright teal
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 6, 78, 59),
        [System.Drawing.Color]::FromArgb(255, 5, 150, 105),
        45.0
    )
    $g.FillRectangle($brush, $rect)

    # Rounded inner ring
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), ($size * 0.03))
    $innerPad = [int]($size * 0.06)
    $innerSize = $size - (2 * $innerPad)
    $g.DrawEllipse($pen, $innerPad, $innerPad, $innerSize, $innerSize)

    # Gold accent dot / star
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $dotSize = [int]($size * 0.12)
    $dotX = [int]($size * 0.72)
    $dotY = [int]($size * 0.18)
    $g.FillEllipse($accentBrush, $dotX, $dotY, $dotSize, $dotSize)

    # Text "KW"
    $fontSize = [int]($size * 0.44)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Center text box
    $textRect = New-Object System.Drawing.RectangleF(0, ($size * 0.18), $size, ($size * 0.50))
    $g.DrawString("KW", $font, $textBrush, $textRect, $format)

    # Subtitle "KAAMWALE" if size >= 96
    if ($size -ge 96) {
        $subFontSize = [int]($size * 0.11)
        $subFont = New-Object System.Drawing.Font("Arial", $subFontSize, [System.Drawing.FontStyle]::Bold)
        $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 209, 250, 229))
        $subRect = New-Object System.Drawing.RectangleF(0, ($size * 0.68), $size, ($size * 0.20))
        $g.DrawString("KAAMWALE", $subFont, $subBrush, $subRect, $format)
        $subFont.Dispose()
    }

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated $path ($size x $size)"
}
