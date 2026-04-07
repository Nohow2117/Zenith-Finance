param(
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$Vps = "artdefinance@185.165.169.119"
$RemoteBaseDir = "/home/artdefinance/deployments/artdefinance"
$RemoteIncomingDir = "$RemoteBaseDir/incoming"
$ReleaseId = Get-Date -Format "yyyyMMdd-HHmmss"
$ArtifactName = "artdefinance-$ReleaseId.tar.gz"
$ArtifactPath = Join-Path $env:TEMP $ArtifactName
$StageDir = Join-Path $env:TEMP "artdefinance-release-$ReleaseId"
$LinuxBindingPackage = "libsql-linux-x64-gnu-0.5.29.tgz"
$RemoteArtifactPath = "$RemoteIncomingDir/$ArtifactName"
$RemoteScriptPath = "$RemoteIncomingDir/deploy-remote.sh"
$RemoteBinDir = "$RemoteBaseDir/bin"
$RemoteRollbackScriptPath = "$RemoteBinDir/rollback-release.sh"

function Invoke-Robocopy {
  param(
    [string]$Source,
    [string]$Destination
  )

  robocopy $Source $Destination /E /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -gt 7) {
    throw "robocopy failed for $Source -> $Destination with exit code $LASTEXITCODE"
  }
}

function Get-UnixText {
  param(
    [string]$Path
  )

  return ((Get-Content -Raw $Path) -replace "`r`n", "`n") -replace "`r", "`n"
}

try {
  Write-Host "`n=== BUILD ===" -ForegroundColor Cyan
  if (-not $SkipBuild) {
    npm run build
    if ($LASTEXITCODE -ne 0) {
      throw "Build failed"
    }
  } else {
    Write-Host "Skipped build by request" -ForegroundColor Yellow
  }

  Write-Host "`n=== STAGE ===" -ForegroundColor Cyan
  if (Test-Path $StageDir) {
    Remove-Item $StageDir -Recurse -Force
  }
  if (Test-Path $ArtifactPath) {
    Remove-Item $ArtifactPath -Force
  }
  if (Test-Path $LinuxBindingPackage) {
    Remove-Item $LinuxBindingPackage -Force
  }

  New-Item $StageDir -ItemType Directory | Out-Null
  npm pack @libsql/linux-x64-gnu@0.5.29 | Out-Null

  Invoke-Robocopy ".next\standalone" $StageDir
  if (Test-Path "$StageDir\.env") {
    Remove-Item "$StageDir\.env" -Force
  }

  New-Item "$StageDir\.next" -ItemType Directory -Force | Out-Null
  Invoke-Robocopy ".next\static" "$StageDir\.next\static"

  if (Test-Path "public") {
    Invoke-Robocopy "public" "$StageDir\public"
  }
  if (Test-Path "drizzle") {
    Invoke-Robocopy "drizzle" "$StageDir\drizzle"
  }

  Copy-Item "ecosystem.config.cjs" "$StageDir\ecosystem.config.cjs" -Force
  Copy-Item $LinuxBindingPackage "$StageDir\$LinuxBindingPackage" -Force

  Write-Host "`n=== PACK ===" -ForegroundColor Cyan
  tar -czf $ArtifactPath -C $StageDir .
  if ($LASTEXITCODE -ne 0) {
    throw "Artifact creation failed"
  }
  Write-Host "Artifact: $([math]::Round((Get-Item $ArtifactPath).Length / 1MB, 1)) MB" -ForegroundColor Gray

  Write-Host "`n=== UPLOAD ===" -ForegroundColor Cyan
  ssh $Vps "mkdir -p $RemoteIncomingDir $RemoteBinDir"
  scp $ArtifactPath "${Vps}:${RemoteArtifactPath}"
  (Get-UnixText "scripts/rollback-remote.sh") | ssh $Vps "cat > $RemoteRollbackScriptPath && sed -i 's/\r$//' $RemoteRollbackScriptPath && chmod +x $RemoteRollbackScriptPath"

  Write-Host "`n=== RELEASE ===" -ForegroundColor Cyan
  (Get-UnixText "scripts/deploy-remote.sh") | ssh $Vps "cat > $RemoteScriptPath && sed -i 's/\r$//' $RemoteScriptPath && chmod +x $RemoteScriptPath && bash $RemoteScriptPath '$ReleaseId' '$RemoteArtifactPath' '$LinuxBindingPackage'"

  Write-Host "`n=== DONE ===" -ForegroundColor Green
  Write-Host "Release deployed: $ReleaseId" -ForegroundColor Green
} finally {
  if (Test-Path $StageDir) {
    Remove-Item $StageDir -Recurse -Force
  }
  if (Test-Path $ArtifactPath) {
    Remove-Item $ArtifactPath -Force
  }
  if (Test-Path $LinuxBindingPackage) {
    Remove-Item $LinuxBindingPackage -Force
  }
}
