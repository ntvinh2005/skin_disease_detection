from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms
from PIL import Image
import io

class_labels = [
    'Eczema',
    'Melanoma',
    'Basal Cell Carcinoma',
    'Melanocytic Nevi',
    'Benign Keratosis-like Lesions',
    'Psoriasis pictures Lichen Planus and related diseases',
    'Seborrheic Keratoses and other Benign Tumors',
    'Tinea Ringworm Candidiasis and other Fungal Infections',
    'Warts Molluscum and other Viral Infections'
]

class CustomDenseNet121(nn.Module):
    def __init__(self, num_classes=10):
        super(CustomDenseNet121, self).__init__()
        self.base_model = models.densenet121(weights=models.DenseNet121_Weights.DEFAULT)
        self.base_model.classifier = nn.Identity()  

        self.fc1 = nn.Linear(1024, 512) 
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(512, num_classes)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.base_model(x)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        x = self.softmax(x)
        return x

app = Flask(__name__)
CORS(app)

model = torch.load('model.pth', map_location='cpu')
model.eval()

transform = transforms.Compose([
    transforms.Resize((75, 100)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image = Image.open(io.BytesIO(file.read())).convert('RGB')
        image = transform(image).unsqueeze(0)

        with torch.no_grad():
            outputs = model(image)
            probs = torch.softmax(outputs, dim=1).squeeze().cpu().numpy() 
            top_indices = probs.argsort()[-3:][::-1]  
            top_probs = probs[top_indices]
            top_labels = [class_labels[i] for i in top_indices]

        predictions = [{'class': label, 'score': float(score)} for label, score in zip(top_labels, top_probs)]
        return jsonify(predictions), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


