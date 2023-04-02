import axios from 'axios'

const api_endpoint_pinata_post = "https://api.pinata.cloud/pinning/pinFileToIPFS"
const api_endpoint_pinata_get = "https://gateway.pinata.cloud/ipfs/"
const access_token = "..."
const authorization = "Bearer " + access_token

export const getFromIPFS = async (fileHash: string, fileName: string) => {
    const res = await axios.get(api_endpoint_pinata_get + fileHash, {
        headers: {
            'Accept': 'text/plain',
        },
        responseType: 'blob'
    })
    console.log(res)
    const href = URL.createObjectURL(res.data);

    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    return res.data
}

export const addToIPFS = async (fileToUpload: Blob, fileName: string) => {
    const formData = new FormData()
    formData.append("file", fileToUpload)
    formData.append("pinataMetadata", JSON.stringify({
        name: fileName
    }))
    formData.append("pinataOptions", JSON.stringify({
        cidVersion: 0
    }))
    const res = await axios.post(api_endpoint_pinata_post, formData, {
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            "Authorization": authorization
        }
    })
    return res.data.IpfsHash
}