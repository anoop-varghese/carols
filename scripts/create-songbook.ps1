$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$songsDir = Join-Path $root 'src\data\songs'
$catalogText = Get-Content -LiteralPath (Join-Path $songsDir 'index.js') -Raw -Encoding UTF8
$imports = @{}
foreach ($match in [regex]::Matches($catalogText, "import\s+(\w+)\s+from\s+'\./([^']+)'")) { $imports[$match.Groups[1].Value] = $match.Groups[2].Value }
$entries = [regex]::Matches($catalogText, "\{\s*title:\s*'([^']+)'\s*,\s*content:\s*(\w+),\s*active:\s*(true|false)(?:,\s*otherLangContent:\s*(\w+))?\s*\}")
$songs = @()
foreach ($entry in $entries) {
    if ($entry.Groups[3].Value -ne 'true') { continue }
    $title = $entry.Groups[1].Value
    $lyricsName = $entry.Groups[2].Value
    $file = Join-Path $songsDir $imports[$lyricsName]
    $source = Get-Content -LiteralPath $file -Raw -Encoding UTF8
    $lyricMatch = [regex]::Match($source, '(?s)const song\s*=\s*`(.*?)`\s*export default song')
    if (-not $lyricMatch.Success) { throw "Could not read song lyrics: $file" }
    $songs += [pscustomobject]@{ Title=$title; Lyrics=$lyricMatch.Groups[1].Value.Trim(); Alternate=$null }
    if ($entry.Groups[4].Success) {
        $altFile = Join-Path $songsDir $imports[$entry.Groups[4].Value]
        $altSource = Get-Content -LiteralPath $altFile -Raw -Encoding UTF8
        $altMatch = [regex]::Match($altSource, '(?s)const song\s*=\s*`(.*?)`\s*export default song')
        if (-not $altMatch.Success) { throw "Could not read alternate lyrics: $altFile" }
        $songs[-1].Alternate = $altMatch.Groups[1].Value.Trim()
    }
}
$songs = @($songs | Sort-Object Title)
function X([string]$s) { [System.Security.SecurityElement]::Escape($s) }
function TextRun([string]$text, [string]$font='Aptos', [int]$size=22, [string]$color='26352F', [bool]$bold=$false) {
    $b=''; if ($bold) {$b='<w:b/>'}
    return "<w:r><w:rPr><w:rFonts w:ascii=`"$font`" w:hAnsi=`"$font`" w:eastAsia=`"Noto Sans Malayalam`"/><w:color w:val=`"$color`"/><w:sz w:val=`"$size`"/>$b</w:rPr><w:t xml:space=`"preserve`">$(X $text)</w:t></w:r>"
}
$body = [System.Text.StringBuilder]::new()
[void]$body.Append('<w:p><w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="page"><wp:align>center</wp:align></wp:positionH><wp:positionV relativeFrom="page"><wp:align>center</wp:align></wp:positionV><wp:extent cx="7772400" cy="10058400"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/><wp:docPr id="1" name="Monochrome Christmas cover illustration"/><wp:cNvGraphicFramePr/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="christmas-cover-print.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId5"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="7772400" cy="10058400"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r></w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="3650" w:after="450"/></w:pPr>'+(TextRun '✦  ST MARYS OSC  ✦' 'Aptos' 22 '111111' $true)+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="170"/></w:pPr>'+(TextRun 'A VERY MERRY' 'Georgia' 34 '111111' $true)+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="200"/></w:pPr>'+(TextRun 'CHRISTMAS' 'Georgia' 60 '111111' $true)+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="350"/></w:pPr>'+(TextRun '✧  SONGBOOK  ✧' 'Georgia' 30 '111111' $true)+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="450" w:after="250"/></w:pPr>'+(TextRun 'Sing the joy of Christmas' 'Georgia' 25 '111111')+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="220"/></w:pPr>'+(TextRun ("$(($songs | Measure-Object).Count) carols   |   English and Malayalam") 'Aptos' 20 '111111')+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="700"/></w:pPr>'+(TextRun '❄     ✦     ❄     ✦     ❄' 'Georgia' 28 '111111')+'</w:p>')
[void]$body.Append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
[void]$body.Append('<w:p><w:pPr><w:spacing w:before="180" w:after="80"/><w:pBdr><w:bottom w:val="single" w:sz="18" w:space="10" w:color="8B2835"/></w:pBdr></w:pPr>'+(TextRun 'THE CAROLS' 'Georgia' 36 '174B38' $true)+'</w:p>')
[void]$body.Append('<w:p><w:pPr><w:spacing w:after="320"/></w:pPr>'+(TextRun 'A little music for a bright and joyful Christmas.' 'Georgia' 21 'A77B3F')+'</w:p>')
foreach ($song in $songs) {
    $slug = [regex]::Replace($song.Title.ToLowerInvariant(), '[^a-z0-9]+', '-')
    $bookmark = "song-$slug"
    $id = 100 + [array]::IndexOf($songs, $song)
    [void]$body.Append("<w:p><w:pPr><w:tabs><w:tab w:val=`"right`" w:leader=`"dot`" w:pos=`"9000`"/></w:tabs><w:spacing w:after=`"100`"/><w:ind w:left=`"160`"/></w:pPr><w:hyperlink w:anchor=`"$bookmark`" w:history=`"1`"><w:r><w:rPr><w:rStyle w:val=`"Hyperlink`"/><w:color w:val=`"174B38`"/></w:rPr><w:t>$(X $song.Title)</w:t></w:r></w:hyperlink><w:r><w:tab/></w:r><w:fldSimple w:instr=`" PAGEREF $bookmark \h `" w:dirty=`"true`"><w:r><w:rPr><w:color w:val=`"8B2835`"/></w:rPr><w:t>3</w:t></w:r></w:fldSimple></w:p>")
}
[void]$body.Append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
foreach ($song in $songs) {
    $slug = [regex]::Replace($song.Title.ToLowerInvariant(), '[^a-z0-9]+', '-')
    $bookmark = "song-$slug"
    $index = [array]::IndexOf($songs, $song) + 1
    [void]$body.Append("<w:bookmarkStart w:id=`"$($index+1)`" w:name=`"$bookmark`"/><w:p><w:pPr><w:spacing w:before=`"260`" w:after=`"110`"/><w:pBdr><w:top w:val=`"single`" w:sz=`"18`" w:space=`"12`" w:color=`"174B38`"/></w:pBdr><w:keepNext/></w:pPr>"+(TextRun ('✦  CAROL  '+$index.ToString('00')) 'Aptos' 18 '8B2835' $true)+'</w:p>')
    [void]$body.Append('<w:p><w:pPr><w:spacing w:after="260"/><w:keepNext/></w:pPr>'+(TextRun $song.Title 'Georgia' 34 '174B38' $true)+'</w:p>')
    foreach ($line in ($song.Lyrics -split "`r?`n")) {
        if ([string]::IsNullOrWhiteSpace($line)) { [void]$body.Append('<w:p><w:pPr><w:spacing w:after="90"/></w:pPr></w:p>'); continue }
        [void]$body.Append('<w:p><w:pPr><w:spacing w:after="90"/><w:keepLines/></w:pPr>'+(TextRun $line.Trim() 'Georgia' 22 '26352F')+'</w:p>')
    }
    if ($song.Alternate) {
        [void]$body.Append('<w:p><w:pPr><w:spacing w:before="300" w:after="160"/><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="8" w:color="A77B3F"/></w:pBdr><w:keepNext/></w:pPr>'+(TextRun 'മലയാളം  |  MALAYALAM' 'Noto Sans Malayalam' 23 '8B2835' $true)+'</w:p>')
        foreach ($line in ($song.Alternate -split "`r?`n")) {
            if ([string]::IsNullOrWhiteSpace($line)) { [void]$body.Append('<w:p><w:pPr><w:spacing w:after="90"/></w:pPr></w:p>'); continue }
            [void]$body.Append('<w:p><w:pPr><w:spacing w:after="90"/><w:keepLines/></w:pPr>'+(TextRun $line.Trim() 'Noto Sans Malayalam' 22 '26352F')+'</w:p>')
        }
    }
    [void]$body.Append("<w:bookmarkEnd w:id=`"$($index+1)`"/>")
}
$document = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>$($body.ToString())<w:sectPr><w:headerReference w:type="default" r:id="rId2"/><w:footerReference w:type="default" r:id="rId3"/><w:titlePg/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="900" w:right="1050" w:bottom="900" w:left="1050" w:header="420" w:footer="420" w:gutter="0"/></w:sectPr></w:body></w:document>
"@
$temp = Join-Path ([System.IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
$null = New-Item -ItemType Directory -Path $temp
try {
    $dirs = @('_rels','word','word\_rels','word\media')
    foreach ($dir in $dirs) {$null=New-Item -ItemType Directory -Path (Join-Path $temp $dir)}
    $utf8 = [System.Text.UTF8Encoding]::new($false)
    [IO.File]::WriteAllText((Join-Path $temp '[Content_Types].xml'), '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/></Types>', $utf8)
    [IO.File]::WriteAllText((Join-Path $temp '_rels\.rels'), '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>', $utf8)
    [IO.File]::WriteAllText((Join-Path $temp 'word\document.xml'), $document, $utf8)
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'christmas-cover-print.png') -Destination (Join-Path $temp 'word\media\christmas-cover-print.png')
    [IO.File]::WriteAllText((Join-Path $temp 'word\styles.xml'), '<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos" w:eastAsia="Noto Sans Malayalam"/><w:color w:val="26352F"/><w:sz w:val="22"/></w:rPr><w:pPr><w:spacing w:line="300" w:lineRule="auto"/></w:pPr></w:style><w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr><w:color w:val="26352F"/><w:u w:val="none"/></w:rPr></w:style></w:styles>', $utf8)
    [IO.File]::WriteAllText((Join-Path $temp 'word\header1.xml'), '<?xml version="1.0" encoding="UTF-8"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="8" w:color="A77B3F"/></w:pBdr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Aptos"/><w:color w:val="174B38"/><w:sz w:val="16"/><w:b/></w:rPr><w:t>ST MARYS OSC</w:t></w:r><w:r><w:tab/></w:r><w:r><w:rPr><w:color w:val="8B2835"/><w:sz w:val="16"/><w:b/></w:rPr><w:t>CHRISTMAS SONGBOOK</w:t></w:r></w:p></w:hdr>', $utf8)
    [IO.File]::WriteAllText((Join-Path $temp 'word\footer1.xml'), '<?xml version="1.0" encoding="UTF-8"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="8" w:space="8" w:color="A77B3F"/></w:pBdr></w:pPr><w:r><w:rPr><w:color w:val="8B2835"/><w:sz w:val="18"/></w:rPr><w:t>✦  </w:t></w:r><w:fldSimple w:instr=" PAGE " w:dirty="true"><w:r><w:rPr><w:color w:val="174B38"/><w:b/></w:rPr><w:t>1</w:t></w:r></w:fldSimple><w:r><w:rPr><w:color w:val="8B2835"/><w:sz w:val="18"/></w:rPr><w:t>  ✦</w:t></w:r></w:p></w:ftr>', $utf8)
    [IO.File]::WriteAllText((Join-Path $temp 'word\settings.xml'), '<?xml version="1.0" encoding="UTF-8"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:updateFields w:val="true"/></w:settings>', $utf8)
    [IO.File]::WriteAllText((Join-Path $temp 'word\_rels\document.xml.rels'), '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/christmas-cover-print.png"/></Relationships>', $utf8)
    $out = Join-Path $root 'Christmas-Carols-Songbook-Print-Compact.docx'
    if (Test-Path -LiteralPath $out) {Remove-Item -LiteralPath $out -Force}
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = [IO.Compression.ZipFile]::Open($out, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($file in Get-ChildItem -LiteralPath $temp -File -Recurse) {
            $entryName = $file.FullName.Substring($temp.Length + 1).Replace('\','/')
            [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $entryName, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $archive.Dispose() }
    $word = $null
    $doc = $null
    try {
        $word = New-Object -ComObject Word.Application
        $word.Visible = $false
        $word.DisplayAlerts = 0
        $doc = $word.Documents.Open($out, $false, $false)
        $doc.Repaginate()
        [void]$doc.Fields.Update()
        foreach ($section in $doc.Sections) {
            foreach ($header in $section.Headers) { [void]$header.Range.Fields.Update() }
            foreach ($footer in $section.Footers) { [void]$footer.Range.Fields.Update() }
        }
        $doc.Repaginate()
        [void]$doc.Fields.Update()
        $pageRefs = @($doc.Fields | Where-Object { $_.Code.Text -match 'PAGEREF' } | ForEach-Object { $_.Result.Text })
        $doc.Save()
        Write-Output "Recalculated index page references: $($pageRefs -join ', ')"
    } finally {
        if ($doc) { $doc.Close(0) }
        if ($word) { $word.Quit() }
    }
    Write-Output "Created $out with $($songs.Count) songs."
} finally {Remove-Item -LiteralPath $temp -Recurse -Force}
