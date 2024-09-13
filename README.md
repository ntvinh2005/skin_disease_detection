# Skin Disease Detection model + demo app

## Overview

The **Skin Disease Detection model** is capable of predicting and distinguishing between 9 common skin diseases with an accuracy exceeding 75%. Trained on the Kaggle "Skin Diseases Image Dataset" by Ismail Hossain, the model leverages transfer learning to optimize both accuracy and computational efficiency. Various techniques, such as early stopping and learning rate scheduling, are employed to prevent overfitting and improve performance.

## Features

- **Input**: Image with dimension (1, 3, 75, 100).
- **Output**: 9 output classes corresponding to 9 skin diseases.
- **Transfer learning**: Use DenseNet121 as base model for transfer learning.
- **Dataset**: Train on Kaggle "Skin disease image dataset" uploaded by Ismail Hossain. Read more about dataset information in Dataset section.

## Technologies Used

- **NextJs**: Framework for building demo app interface.
- **Flask**: Web framework for building the server-side application.
- **PyTorch**: Machine learning library based on Torch library.

## Dataset
### Dataset "Skin disease image dataset" on Kaggle
Contain about 27200 .jpg image files, arranged into 10 folders named after 10 popular skin diseases. However, since Eczema and Atopic Dermatitis are the same disease, so when preparing data, I have removed folder Atopic to reduce potential confusion or bias.

This is the dataset I officially use to train model in skin_disease_detection notebook.
Link to dataset here [Skin disease image dataset](https://www.kaggle.com/datasets/ismailpromus/skin-diseases-image-dataset)

### Dataset SCIN (Skin Condition Image Network) 
Open access dataset aims to supplement publicly available dermatology datasets from health system sources with representative images from internet users. 

The SCIN dataset provides over 10,000 images contributed by volunteers, along with self-reported demographic, history, and symptom information, including Fitzpatrick skin type (sFST). Dermatologists also provided labels for skin conditions and estimated Fitzpatrick skin type (eFST), along with layperson-estimated Monk Skin Tone (eMST) labels.

During training, I found that the SCIN dataset suffers from class imbalance, with some skin conditions having only 30 images compared to others having over 1,000. Even after reducing the number of output classes, there weren't enough images for each class to train a model with decent accuracy.
This is my failed experiment with the dataset. It should have been used for different purposes, or by different methods. You can see the result in bigram notebook.
Link to dataset here [SCIN](https://github.com/google-research-datasets/scin)

## Contributing
Contributions to the project are welcome. Please follow these steps:
1. **Folk the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/YourFeature
3. **Make your changes and commit:**
   ```bash
   git commit -m 'Add new feature'
4. **Push to your branch:**
   ```bash
   git push origin feature/YourFeature
5. **Open a Pull Request.**
   
## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
For questions, suggestions, or access, please email ntvinhgv@gmail.com.

## Acknowledgement
- [Kaggle](https://www.kaggle.com/) for providing the dataset.
- [PyTorch](https://pytorch.org/) for machine learning library.
