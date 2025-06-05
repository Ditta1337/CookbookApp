import subprocess

def get_pid_using_port(port):
    try:
        # Uruchom PowerShell i wyciągnij PID z portu
        result = subprocess.run(
            ["powershell", "-Command", f"(Get-NetTCPConnection -LocalPort {port}).OwningProcess"],
            capture_output=True,
            text=True
        )
        pid_str = result.stdout.strip()
        if not pid_str.isdigit():
            print("Nie znaleziono procesu nasłuchującego na porcie", port)
            return None
        return int(pid_str)
    except Exception as e:
        print("Błąd:", e)
        return None

def kill_process(pid):
    try:
        subprocess.run(["taskkill", "/PID", str(pid), "/F"], check=True)
        print(f"Zabito proces o PID {pid}")
    except subprocess.CalledProcessError as e:
        print(f"Nie udało się zabić procesu PID {pid}:", e)

if __name__ == "__main__":
    port = 8000
    pid = get_pid_using_port(port)
    if pid:
        kill_process(pid)
