import cv2
import numpy as np
def preprocess(image):
    _, image = cv2.threshold(
        image,
        0,
        255,
        cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    coords = cv2.findNonZero(image)

    if coords is None:
        raise ValueError("No digit found")

    
    x, y, w, h = cv2.boundingRect(coords)
    image = image[y:y+h, x:x+w]

    image = cv2.resize(image, (28, 28))

    M = cv2.moments(image)

    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])

        shift_x = 14 - cx
        shift_y = 14 - cy

        matrix = np.float32([
            [1, 0, shift_x],
            [0, 1, shift_y]
        ])

        image = cv2.warpAffine(
            image,
            matrix,
            (28, 28)
        )

    image = image.astype(np.float32) / 255.0

    return image