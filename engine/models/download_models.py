import os
import gdown

FILES = {
    "cat_encoder.pkl": "https://drive.google.com/file/d/1fEQpwfVPtpWaj2UB3HAZ-3XBnx_2m4gH/view?usp=sharing",
    "pri_encoder.pkl": "https://drive.google.com/file/d/1c1kadNxN3hA1js1fRJ_H3Y5_Et71W8-P/view?usp=sharing",
}

FOLDERS = {
    "category_model": "https://drive.google.com/drive/folders/1m3uB0HT8HocsqX4cCgzm-uDDTo2sxi-6?usp=sharing",
    "priority_model": "https://drive.google.com/drive/folders/1GgbhUMdDMFWiOX0fPWskPZXwm0LAjJ8F?usp=sharing",
    "tokenizer": "https://drive.google.com/drive/folders/18tLji_seha72iGfZ_I6xxjjIGLdAbwbi?usp=drive_link",
}

def download_files():
    for filename, file_url in FILES.items():
        output = os.path.join(os.getcwd(), filename)

        if not os.path.exists(output):
            print(f"\nDownloading file: {filename}")
            try:
                gdown.download(file_url, output, quiet=False, fuzzy=True)
            except Exception as e:
                print(f"Failed to download {filename}: {e}")
        else:
            print(f"{filename} already exists.")


def download_folders():
    for folder_name, folder_url in FOLDERS.items():
        output = os.path.join(os.getcwd(), folder_name)

        if not os.path.exists(output):
            print(f"\nDownloading folder: {folder_name}")
            try:
                gdown.download_folder(
                    url=folder_url,
                    output=output,
                    quiet=False,
                    use_cookies=False
                )
            except Exception as e:
                print(f"Failed to download folder {folder_name}: {e}")
        else:
            print(f"Folder {folder_name} already exists. Skipping.")


if __name__ == "__main__":
    print("Starting model download...\n")

    download_files()
    download_folders()

    print("\n All models downloaded")