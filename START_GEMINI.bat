@echo off
cd /d "%~dp0"
py -c "import getpass,os,runpy; os.environ['GEMINI_API_KEY']=getpass.getpass('Enter Gemini API key: '); runpy.run_path('server.py',run_name='__main__')"
pause
