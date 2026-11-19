import json
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

def classify():
    y_pred_full, y_test_full = [], []

    with open ("traces_amazon_github_google_youtube_20x5s.json", "r") as f:
        data = json.load(f)

        # Converts the 2-dimensional array into Numpy for data processing
        traces = np.array(data["traces"])
        labels = np.array(data["labels"])

    for i in range(10): # Re-trains 10 times to reduce effects of randomness
        X_train, X_test, y_train, y_test = (
            train_test_split(traces, labels, test_size=0.2, stratify=labels)
        )

        # Trains classifier
        rfc = RandomForestClassifier()
        rfc.fit(X_train, y_train)

        y_pred = rfc.predict(X_test)    # Uses classifier to make predictions on X_test

        y_test_full.extend(y_test)
        y_pred_full.extend(y_pred)

    print(classification_report(y_test_full, y_pred_full))

if __name__ == "__main__":
    classify()