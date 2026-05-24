from ultralytics import YOLO
import cv2
import requests

model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    results = model(frame)

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]

            if name in ["person"]:
                status = "NORMAL"
            else:
                status = "DANGER"

            print("Detected:", name, status)

            # kirim ke backend
            requests.post("http://localhost:5000/api/cctv", json={
                "object": name,
                "status": status
            })

    cv2.imshow("AI CCTV", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()