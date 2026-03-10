$ErrorActionPreference = "Stop"

$repos = @(
	"https://github.com/webchirpy-new/ordering-backend",
	"https://github.com/webchirpy-new/ordering-frontend",
	"https://github.com/webchirpy-new/brilliantoffice_mob",
	"https://github.com/webchirpy-new/mytax",
	"https://github.com/webchirpy-new/mytax_web",
	"https://github.com/webchirpy-new/mytax_app"
)

$source_dir = "c:\Users\HARI_JOHNSON\Desktop\hari\webchirpy-dock"
$temp_dir = "$source_dir\temp_repos"
if (-not (Test-Path -Path $temp_dir)) {
	New-Item -ItemType Directory -Path $temp_dir | Out-Null
}

foreach ($repo in $repos) {
	if ($repo -match "/([^/]+)$") {
		$repo_name = $matches[1]
	}
 else {
		continue
	}

	$repo_path = "$temp_dir\$repo_name"
    
	if (-not (Test-Path -Path $repo_path)) {
		Write-Host "Cloning $repo_name..."
		git -C $temp_dir clone $repo
	}
 else {
		Write-Host "Directory $repo_path already exists. Pulling latest..."
		git -C $repo_path pull
	}
    
	if (-not (Test-Path -Path "$repo_path\.github\workflows")) {
		New-Item -ItemType Directory -Path "$repo_path\.github\workflows" -Force | Out-Null
	}
	if (-not (Test-Path -Path "$repo_path\scripts")) {
		New-Item -ItemType Directory -Path "$repo_path\scripts" -Force | Out-Null
	}
    
	# Copy files
	Copy-Item "$source_dir\.github\workflows\auto-docs.yml" -Destination "$repo_path\.github\workflows\auto-docs.yml" -Force
	Copy-Item "$source_dir\scripts\generateCommitDocs.js" -Destination "$repo_path\scripts\generateCommitDocs.js" -Force
    
	# Determine default branch
	$branch = (git -C $repo_path rev-parse --abbrev-ref HEAD).Trim()
	Write-Host "${repo_name} default branch is: $branch"
    
	# Update auto-docs.yml
	$content = Get-Content "$repo_path\.github\workflows\auto-docs.yml" -Raw
    
	# 1. Update npm install
	$content = $content -replace "run: npm install(\r?\n)", "run: npm install @openrouter/sdk --no-save`$1"
    
	# 2. Update branch name if not main
	if ($branch -ne "main") {
		$content = $content -replace "branches:\s*- main", "branches:`n      - $branch"
		$content = $content -replace "base: main", "base: $branch"
	}
    
	Set-Content -Path "$repo_path\.github\workflows\auto-docs.yml" -Value $content
    
	# Commit and push
	Write-Host "Staging and committing for ${repo_name}..."
	git -C $repo_path add .github/workflows/auto-docs.yml scripts/generateCommitDocs.js
    
	# check if anything changed
	try {
		git -C $repo_path commit -m "docs: auto generate commit docs configuration setup"
		Write-Host "Pushing ${repo_name}..."
		git -C $repo_path push origin HEAD
	}
 catch {
		Write-Host "${repo_name}: Nothing to commit or push failed."
	}
	Write-Host "---------------------------------"
}

Write-Host "All repositories processed."
