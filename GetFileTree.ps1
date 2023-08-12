function Get-FileTree {
    param (
        [string]$Path = ".",
        [int]$Indent = 0,
        [string[]]$Exclude = @('node_modules', '.yarn', 'yarn.lock', 'ckeditor')
    )

    $items = Get-ChildItem -Path $Path

    foreach ($item in $items) {
        if ($Exclude -notcontains $item.Name) {
            $padding = " " * $Indent
            Write-Output "$padding$item"

            if ($item.PSIsContainer) {
                Get-FileTree -Path $item.FullName -Indent ($Indent + 2) -Exclude $Exclude
            }
        }
    }
}

Get-FileTree | Out-File -FilePath 'filetree.txt'