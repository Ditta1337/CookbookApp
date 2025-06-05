import subprocess
import re

def get_pid_using_port(port):
    try:
        result = subprocess.run(
            ["netstat", "-aon"], capture_output=True, text=True
        )
        for line in result.stdout.splitlines():
            if f":{port} " in line:
                # Format: Proto  Local Address  Foreign Address  State  PID
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    if pid.isdigit():
                        return int(pid)
        print(f"Nie znaleziono procesu nasłuchującego na porcie {port}")
        return None
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
