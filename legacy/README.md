# Skillnova Python Project

This workspace is configured as a Python project with a reusable package named `skillnova`.

## Setup

1. Create and activate the virtual environment:
   - PowerShell:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```

2. Install dependencies:
   ```powershell
   python -m pip install -U pip
   python -m pip install -r requirements.txt
   ```

## Run

```powershell
python -m skillnova
```

## Test

```powershell
python -m pytest
```
