Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path 'TheNaomiHQ_Website_Brief.docx') {
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path 'TheNaomiHQ_Website_Brief.docx'))
    $entry = $zip.GetEntry('word/document.xml')
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()
    ($xml -replace '<[^>]+>', ' ') | Out-File -FilePath 'brief_docx_text.txt' -Encoding utf8
    Write-Output "Brief DOCX extracted! Length: $($xml.Length)"
}
if (Test-Path 'Naomi HQ Mood Board Inspiration .docx') {
    $zip2 = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path 'Naomi HQ Mood Board Inspiration .docx'))
    $entry2 = $zip2.GetEntry('word/document.xml')
    if ($entry2) {
        $stream2 = $entry2.Open()
        $reader2 = New-Object System.IO.StreamReader($stream2)
        $xml2 = $reader2.ReadToEnd()
        $reader2.Close()
        $stream2.Close()
        ($xml2 -replace '<[^>]+>', ' ') | Out-File -FilePath 'moodboard_docx_text.txt' -Encoding utf8
        Write-Output "Moodboard DOCX extracted! Length: $($xml2.Length)"
    }
    $zip2.Dispose()
}
