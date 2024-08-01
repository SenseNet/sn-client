# Define the paths
$snClientPath = "C:\Users\kovacsn\Desktop\SenseNet\sn-client"
$sensenetAppPath = "C:\Users\kovacsn\Desktop\SenseNet\sn-client\apps\sensenet"
$desktopPath = "C:\Users\kovacsn\Desktop"

# Navigate to the sn-client directory and run yarn build
Write-Host "Navigating to $snClientPath and running yarn build..."
Set-Location -Path $snClientPath
yarn build

# Check if the build succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "yarn build failed."
    exit $LASTEXITCODE
}

# Navigate to the sensenet app directory and run npm start
Write-Host "Navigating to $sensenetAppPath and running npm start..."
Set-Location -Path $sensenetAppPath
npm start

# Check the exit code of npm start
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm start failed."
    exit $LASTEXITCODE
}

# Navigate back to the desktop
Write-Host "Navigating back to $desktopPath..."
Set-Location -Path $desktopPath
Write-Host "Script completed."
