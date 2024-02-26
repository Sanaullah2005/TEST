import json
import os
from git import Repo

# Replace these variables with your actual access token and repository name
ACCESS_TOKEN = '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'
REPO_NAME = 'TEST'

def add_json_file_to_repo():
    try:
        # Clone the repository
        repo = Repo.clone_from(f'https://github.com/Sanaullah2005/{REPO_NAME}.git', REPO_NAME)
        
        # Define file content (you can modify this JSON content as per your requirement)
        file_content = {
            "key1": "value1",
            "key2": "value2",
            "key3": "value3"
        }

        # Define the file path
        file_path = os.path.join(repo.working_tree_dir, 'data.json')

        # Write the JSON content to the file
        with open(file_path, 'w') as file:
            json.dump(file_content, file)

        # Add the file to the repository
        repo.index.add(['data.json'])
        repo.index.commit("Add data.json")  # Commit the change

        # Push the changes to the remote repository
        origin = repo.remote(name='origin')
        origin.push()

        print("JSON file added successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    add_json_file_to_repo()
