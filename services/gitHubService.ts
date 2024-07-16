import dotenv from "dotenv";
import {Buffer} from "buffer";

dotenv.config();
export class gitHubService {

    baseURL = `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/`;

    static writeFile(filePath: string, data: string) {

        try{

            const encodedContent = Buffer.from(data).toString('base64');

            const payload = {
                message: 'Update file via API',
                content: encodedContent,
                branch: "main",
            };

            const response = fetch(`${this.baseURL}${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 201) {
                console.log('File created successfully');
            } else if (response.status === 200) {
                console.log('File updated successfully');
            } else {
                console.error('Failed to create or update file');
            }

        }catch (error) {
            console.log(error);
        }

    }

}