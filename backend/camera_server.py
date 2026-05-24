from flask import Flask, Response
import cv2

app = Flask(__name__)

# =========================
# OPEN CAMERA
# =========================

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not camera.isOpened():
    print("Camera failed to open")

# =========================
# VIDEO GENERATOR
# =========================

def generate():

    while True:

        success, frame = camera.read()

        if not success:
            print("Failed to read frame")
            break

        # =========================
        # SMOKE DETECTION SIMULATION
        # =========================

        smoke_detected = False

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        brightness = gray.mean()

        # SIMPLE SMOKE SIMULATION
        if brightness > 120:
            smoke_detected = True

        # =========================
        # ALERT TEXT
        # =========================

        if smoke_detected:

            print("SMOKE DETECTED")

            cv2.putText(
                frame,
                "SMOKE DETECTED",
                (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                3
            )

        else:

            cv2.putText(
                frame,
                "SYSTEM NORMAL",
                (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                3
            )

        # =========================
        # ENCODE FRAME
        # =========================

        _, buffer = cv2.imencode('.jpg', frame)

        frame = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' +
            frame +
            b'\r\n'
        )

# =========================
# VIDEO ROUTE
# =========================

@app.route('/video')

def video():

    return Response(
        generate(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

# =========================
# HOME ROUTE
# =========================

@app.route('/')

def home():

    return "AI Camera Server Running"

# =========================
# RUN SERVER
# =========================

if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=8000
    )