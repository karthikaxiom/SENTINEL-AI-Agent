@echo off
cd /d "%~dp0"
echo SENTINEL - local intelligence
echo Paste a NEW Gemini key when prompted, or press Enter for offline mode.
py -c "import os,runpy; os.environ['GEMINI_API_KEY']=input('Gemini API key: ').strip(); runpy.run_path('server.py',run_name='__main__')"
pause
